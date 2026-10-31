const { chromium } = require('playwright');

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
        // 1. Authenticate as Teacher
        console.log('Step 1: Navigating to teacher.html...');
        await page.goto('http://127.0.0.1:5000/teacher.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1000);

        // Check if teacher activation is needed
        const becomeBtn = await page.$('#btn-become-teacher');
        if (becomeBtn && await becomeBtn.isVisible()) {
            console.log('Activating teacher mode...');
            await page.evaluate(async () => {
                await fetch('/api/teacher/become', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: 'TEACHER2026' })
                });
            });
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(1000);
        }

        // 2. Check Teacher Tabs and Schedule
        console.log('Step 2: Checking schedule tab...');
        const scheduleTab = await page.$('#tab-btn-schedule');
        assert(scheduleTab !== null, 'Schedule tab button exists');
        if (scheduleTab) {
            await scheduleTab.click();
            await page.waitForTimeout(500);
        }

        // 3. Check "Методический план" button in Teacher Schedule Hero
        console.log('Step 3: Checking methodical plan button in schedule hero...');
        const planBtn = await page.$('#btn-open-teacher-methodical-plan');
        assert(planBtn !== null, 'Methodical Plan button exists in Teacher schedule hero');

        // 4. Open Methodical Plan Modal
        console.log('Step 4: Opening methodical plan modal...');
        await planBtn.click();
        await page.waitForSelector('#methodical-plan-modal[open]', { timeout: 5000 });
        const modalVisible = await page.evaluate(() => {
            const m = document.getElementById('methodical-plan-modal');
            return m && m.open;
        });
        assert(modalVisible, 'Methodical Plan modal opened successfully');

        // 5. Load OGE Math Template
        console.log('Step 5: Loading OGE Math template...');
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        const loadTmplBtn = await page.$('#mp-btn-load-template');
        assert(loadTmplBtn !== null, 'Load template button exists');
        if (loadTmplBtn && await loadTmplBtn.isVisible()) {
            await loadTmplBtn.click();
            await page.waitForTimeout(600);
        } else {
            const createFirstBtn = await page.$('#mp-btn-create-first');
            if (createFirstBtn && await createFirstBtn.isVisible()) {
                await createFirstBtn.click();
                await page.waitForTimeout(600);
            }
        }

        // 6. Verify Template Data Loaded
        console.log('Step 6: Verifying template data...');
        const planTitle = await page.$eval('#mp-inp-title', el => el.value);
        assert(planTitle.includes('Аспидов Роман') || planTitle.includes('математике'), `Plan title correctly loaded: "${planTitle}"`);

        const topicsCount = await page.$$eval('.mp-topic-item', rows => rows.length);
        assert(topicsCount === 19, `Loaded 19 topics matching PDF (found: ${topicsCount})`);

        const part2Highlighted = await page.$$eval('.mp-topic-item.is-part2', rows => rows.length);
        assert(part2Highlighted >= 5, `Part 2 topics are highlighted with violet badge (found: ${part2Highlighted})`);

        // 7. Verify Auto-calculated Total
        console.log('Step 7: Verifying auto-calculated yearly total...');
        const totalYearText = await page.$eval('#mp-year-total-val', el => el.textContent.trim());
        assert(totalYearText.includes('59'), `Total yearly lessons calculated as 59 (found: ${totalYearText})`);

        // 8. Test Dynamic Recalculation: increase September to 5 lessons
        console.log('Step 8: Testing dynamic recalculation...');
        await page.$eval('.mp-month-card[data-month="Сентябрь"] .mp-month-count-inp', el => {
            el.value = '5';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForTimeout(300);
        const updatedTotal = await page.$eval('#mp-year-total-val', el => el.textContent.trim());
        assert(updatedTotal.includes('64'), `Dynamically updated total to 64 when September changed to 5 (found: ${updatedTotal})`);

        // Set September back to 0
        await page.$eval('.mp-month-card[data-month="Сентябрь"] .mp-month-count-inp', el => {
            el.value = '0';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForTimeout(300);

        // 9. Verify Conducted Lessons Tracking Table [x]
        console.log('Step 9: Verifying conducted lessons checkboxes...');
        const octCheckboxes = await page.$$('.mp-month-schedule-card:has(h4:has-text("Октябрь")) .mp-check-btn');
        assert(octCheckboxes.length === 2, `October has 2 lesson checkboxes (found: ${octCheckboxes.length})`);

        const novCheckboxes = await page.$$('.mp-month-schedule-card:has(h4:has-text("Ноябрь")) .mp-check-btn');
        assert(novCheckboxes.length === 8, `November has 8 lesson checkboxes (found: ${novCheckboxes.length})`);

        // Toggle November Lesson 1 to Conducted
        console.log('Step 10: Toggling November lesson 1 to conducted [x]...');
        const novFirstBtn = novCheckboxes[0];
        await novFirstBtn.click();
        await page.waitForTimeout(400);
        const novFirstIsChecked = await novFirstBtn.evaluate(el => el.classList.contains('is-checked'));
        assert(novFirstIsChecked, 'November lesson 1 marked as conducted [x]');

        // 10. Save Plan to Server
        console.log('Step 11: Saving plan to server...');
        const saveBtn = await page.$('#mp-btn-save');
        assert(saveBtn !== null, 'Save Plan button exists');
        await saveBtn.click();
        await page.waitForTimeout(1200);

        // Close modal
        await page.$eval('#mp-modal-close-btn', el => el.click());
        await page.waitForTimeout(300);

        // 11. Verify in profile.html under tab "Учёба и расписание"
        console.log('Step 12: Verifying in profile.html...');
        await page.goto('http://127.0.0.1:5000/profile.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1000);

        // Check that "Методический план" button is in profile.html
        const profilePlanBtn = await page.$('#btn-open-methodical-plan');
        assert(profilePlanBtn !== null, 'Button "Методический план" exists in profile.html calendar header');

        await profilePlanBtn.click();
        await page.waitForSelector('#methodical-plan-modal[open]', { timeout: 5000 });
        const profileModalOpen = await page.evaluate(() => {
            const m = document.getElementById('methodical-plan-modal');
            return m && m.open;
        });
        assert(profileModalOpen, 'Methodical Plan modal opened from profile.html');

        const loadedPlanContent = await page.$eval('#mp-content-area', el => el.innerText);
        assert(loadedPlanContent.includes('Аспидов Роман') || loadedPlanContent.includes('59'), 'Saved methodical plan data is rendered in profile view');

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
