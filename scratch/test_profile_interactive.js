const { chromium } = require('F:/Varia/Programming/study_site/node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err));

    // Seed test state
    await page.addInitScript(() => {
        localStorage.setItem('studyUserName', 'Алексей');
        localStorage.setItem('user_xp', '1250');
        localStorage.setItem('totalSolvedTasks', '42');
        localStorage.setItem('studyTrainerRecords', JSON.stringify({
            'oge_task_6': {
                maxStreak: 52,
                currentStreak: 5,
                totalSolved: 60,
                maxRank: 'Знаток вычислений',
                lastTrainedAt: new Date().toISOString()
            },
            'oge_task_8': {
                maxStreak: 15,
                currentStreak: 12,
                totalSolved: 24,
                maxRank: 'Мастер степеней',
                lastTrainedAt: new Date().toISOString()
            }
        }));
    });

    console.log('--- TEST SUITE START ---');
    console.log('1. Navigating to http://127.0.0.1:4400/profile.html...');
    await page.goto('http://127.0.0.1:4400/profile.html', { waitUntil: 'networkidle' });

    // 1. Identity Check
    const nickname = await page.textContent('#profile-nickname');
    console.log(`2. Nickname: "${nickname}" (expected "Алексей")`);
    if (nickname !== 'Алексей') throw new Error('Nickname mismatch');

    const avatar = await page.textContent('#profile-avatar');
    console.log(`3. Avatar: "${avatar}" (expected "А")`);
    if (avatar !== 'А') throw new Error('Avatar mismatch');

    // 2. Inline Name Edit
    console.log('4. Testing Inline Name Editing...');
    await page.click('#edit-name-btn');
    await page.fill('#nickname-input', 'Виктор');
    await page.press('#nickname-input', 'Enter');
    const updatedNickname = await page.textContent('#profile-nickname');
    const updatedAvatar = await page.textContent('#profile-avatar');
    console.log(`5. Updated Nickname: "${updatedNickname}", Avatar: "${updatedAvatar}"`);
    if (updatedNickname !== 'Виктор' || updatedAvatar !== 'В') throw new Error('Inline name edit failed');

    // 3. Tab Switching to Ranks
    console.log('6. Switching to Tab: "Серии и звания"...');
    await page.click('#tab-btn-ranks');
    await page.waitForSelector('.trainer-item-card');
    const cardsCount = await page.locator('.trainer-item-card').count();
    console.log(`7. Total Trainer Cards: ${cardsCount} (expected 9)`);
    if (cardsCount !== 9) throw new Error(`Expected 9 trainer cards, found ${cardsCount}`);

    // 4. Gift claiming for 50-streak
    const giftBtn = page.locator('.trainer-gift-btn.unlocked[data-trainer-id="oge_task_6"]');
    console.log(`8. Unlocked Gift for oge_task_6 present: ${await giftBtn.count() > 0 ? 'YES' : 'NO'}`);
    await page.evaluate(() => {
        const btn = document.querySelector('.trainer-gift-btn.unlocked[data-trainer-id="oge_task_6"]');
        if (btn) btn.click();
    });
    await page.waitForTimeout(500);
    const claimedBtn = page.locator('.trainer-gift-btn.claimed[data-trainer-id="oge_task_6"]');
    console.log(`9. Gift successfully claimed: ${await claimedBtn.count() > 0 ? 'YES' : 'NO'}`);
    if (await claimedBtn.count() === 0) throw new Error('Gift did not transition to claimed state');

    // Screenshot ranks tab
    await page.screenshot({ path: '.shots/profile/showcase-ranks.png', fullPage: true });

    // 5. Settings Dialog & Code Sync
    console.log('10. Opening Settings modal...');
    await page.click('#settings-open-btn');
    await page.waitForSelector('#settings-dialog[open]');
    const exportCode = await page.inputValue('#profile-code-output');
    console.log(`11. Export code starts with STUDY-: ${exportCode.startsWith('STUDY-')}`);
    if (!exportCode.startsWith('STUDY-')) throw new Error('Invalid export code');

    await page.click('#copy-code-btn');
    const copyStatus = await page.textContent('#copy-status');
    console.log(`12. Copy feedback: "${copyStatus}"`);

    await page.screenshot({ path: '.shots/profile/showcase-settings.png' });
    await page.click('#settings-close-btn');

    // 6. Achievements Dialog
    console.log('13. Opening Achievements modal...');
    await page.click('#achievements-open');
    await page.waitForSelector('#achievements-dialog[open]');
    const medalsCount = await page.locator('#achievements-list li').count();
    console.log(`14. Achievements / Medals listed: ${medalsCount}`);
    await page.screenshot({ path: '.shots/profile/showcase-medals.png' });
    await page.click('#achievements-close');

    // 7. Overview tab & Radar subject change
    console.log('15. Switching back to Overview tab...');
    await page.click('#tab-btn-overview');
    await page.waitForSelector('.bento-metrics-grid');

    console.log('16. Changing radar subject to "Физика"...');
    await page.selectOption('#skills-subject', 'Физика');
    await page.waitForTimeout(300);

    await page.screenshot({ path: '.shots/profile/showcase-overview.png', fullPage: true });

    console.log('>>> ALL PROFILE TESTS PASSED 100% SUCCESFULLY! <<<');
    await browser.close();
})();
