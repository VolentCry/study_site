const { chromium } = require('playwright');
const { execSync } = require('child_process');

(async () => {
    console.log('🚀 Starting verification of Methodical Plan & Conducted Lessons tracking...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    let passedTests = 0;
    let failedTests = 0;

    function assert(condition, testName) {
        if (condition) {
            console.log(`  ✅ [PASS] ${testName}`);
            passedTests++;
        } else {
            console.error(`  ❌ [FAIL] ${testName}`);
            failedTests++;
        }
    }

    try {
        // 1. Authenticate and become teacher
        await page.goto('http://127.0.0.1:5000/index.html');
        await page.waitForLoadState('networkidle');

        const uname = 'teacher_' + Date.now();
        await page.evaluate(async (u) => {
            await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: 'password123', displayName: 'Тестовый Учитель' })
            });
        }, uname);

        // Promote user to teacher in DB
        execSync(`python -c "import db; db.set_user_role_by_username('${uname}', 'teacher')"`);
        console.log(`User ${uname} promoted to teacher in DB`);

        // 2. Open Teacher Dashboard
        await page.goto('http://127.0.0.1:5000/teacher.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#teacher-dashboard:not(.hidden)', { timeout: 5000 });

        // Switch to Schedule Tab
        const scheduleTab = await page.$('#tab-btn-schedule');
        assert(scheduleTab !== null, 'Schedule tab button exists');
        await scheduleTab.click();
        await page.waitForTimeout(400);

        // 3. Check "Методический план" button in Teacher Schedule Hero
        const planBtn = await page.$('#btn-open-teacher-methodical-plan');
        assert(planBtn !== null, 'Methodical Plan button exists in Teacher schedule hero');

        // 4. Open Methodical Plan Modal
        await planBtn.click();
        await page.waitForSelector('#modal-methodical-plan[open]', { timeout: 5000 });
        const modalVisible = await page.evaluate(() => {
            const m = document.getElementById('modal-methodical-plan');
            return m && m.open;
        });
        assert(modalVisible, 'Methodical Plan modal opened successfully');

        // 5. Load OGE Math Template
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        const loadTmplBtn = await page.$('#btn-plan-load-template');
        assert(loadTmplBtn !== null, 'Load template button exists');
        await loadTmplBtn.click();
        await page.waitForTimeout(600);

        // 6. Verify Template Data Loaded
        const planTitle = await page.$eval('#plan-input-title', el => el.value);
        assert(planTitle.includes('Аспидов Роман') || planTitle.includes('математике'), `Plan title correctly loaded: "${planTitle}"`);

        const topicsCount = await page.$$eval('.topic-item-row', rows => rows.length);
        assert(topicsCount === 19, `Loaded 19 topics matching PDF (found: ${topicsCount})`);

        const part2Highlighted = await page.$$eval('.topic-item-row.part2-highlight', rows => rows.length);
        assert(part2Highlighted >= 5, `Part 2 topics are highlighted with violet badge (found: ${part2Highlighted})`);

        // 7. Verify Auto-calculated Total
        const totalYearText = await page.$eval('#kpi-val-year-total', el => el.textContent.trim());
        assert(totalYearText === '59', `Total yearly lessons calculated as 59 (found: ${totalYearText})`);

        // 8. Test Dynamic Recalculation: increase September to 5 lessons
        await page.$eval('.month-count-input[data-month="Сентябрь"]', el => {
            el.value = '5';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForTimeout(200);
        const updatedTotal = await page.$eval('#kpi-val-year-total', el => el.textContent.trim());
        assert(updatedTotal === '64', `Dynamically updated total to 64 when September changed to 5 (found: ${updatedTotal})`);

        // Set September back to 0
        await page.$eval('.month-count-input[data-month="Сентябрь"]', el => {
            el.value = '0';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForTimeout(200);

        // 9. Verify Conducted Lessons Tracking Table [x]
        const octCheckboxes = await page.$$('.month-block[data-month="Октябрь"] .lesson-checkbox-btn');
        assert(octCheckboxes.length === 2, `October has 2 lesson checkboxes (found: ${octCheckboxes.length})`);

        const novCheckboxes = await page.$$('.month-block[data-month="Ноябрь"] .lesson-checkbox-btn');
        assert(novCheckboxes.length === 8, `November has 8 lesson checkboxes (found: ${novCheckboxes.length})`);

        // Toggle November Lesson 1 to Conducted
        const novFirstBtn = novCheckboxes[0];
        await novFirstBtn.click();
        await page.waitForTimeout(400);
        const novFirstIsChecked = await novFirstBtn.evaluate(el => el.classList.contains('checked'));
        assert(novFirstIsChecked, 'November lesson 1 marked as conducted [x]');

        // 10. Save Plan to Server
        const saveBtn = await page.$('#btn-plan-save');
        assert(saveBtn !== null, 'Save Plan button exists');
        await saveBtn.click();
        await page.waitForTimeout(1000);

        // Close modal
        await page.$eval('#btn-plan-close', el => el.click());
        await page.waitForTimeout(300);

        // 11. Verify in profile.html under tab "Учёба и расписание"
        await page.goto('http://127.0.0.1:5000/profile.html');
        await page.waitForLoadState('networkidle');

        // Check that "Методический план" button is in profile.html
        const profilePlanBtn = await page.$('#btn-open-methodical-plan');
        assert(profilePlanBtn !== null, 'Button "Методический план" exists in profile.html calendar header');

        await profilePlanBtn.click();
        await page.waitForSelector('#modal-methodical-plan[open]', { timeout: 4000 });
        const profileModalOpen = await page.evaluate(() => {
            const m = document.getElementById('modal-methodical-plan');
            return m && m.open;
        });
        assert(profileModalOpen, 'Methodical Plan modal opened from profile.html');

        const loadedText = await page.$eval('#plan-modal-body', el => el.innerText);
        assert(loadedText.includes('Аспидов Роман') || loadedText.includes('59'), 'Saved methodical plan data is rendered in profile view');

        console.log(`\n========================================`);
        console.log(`Results: ${passedTests} passed, ${failedTests} failed`);
        console.log(`========================================`);

    } catch (e) {
        console.error('Fatal test error:', e);
        failedTests++;
    } finally {
        await browser.close();
        process.exit(failedTests > 0 ? 1 : 0);
    }
})();
