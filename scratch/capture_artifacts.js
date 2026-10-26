const { chromium } = require('F:/Varia/Programming/study_site/node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

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

    await page.goto('http://127.0.0.1:4400/profile.html', { waitUntil: 'networkidle' });

    // Ranks tab shot
    await page.click('#tab-btn-ranks');
    await page.waitForSelector('.trainer-item-card');
    await page.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-ranks-view.png', fullPage: true });

    // Settings modal shot
    await page.click('#settings-open-btn');
    await page.waitForSelector('#settings-dialog[open]');
    await page.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-settings-dialog.png' });

    await browser.close();
    console.log('Artifact screenshots saved successfully!');
})();
