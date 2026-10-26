const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://127.0.0.1:4400/profile.html', { waitUntil: 'networkidle' });
    
    // Screenshot empty state
    const card = page.locator('.diagnostic-card').first();
    await card.screenshot({ path: 'scratch/chart-current-empty.png' });
    
    // Inject mock study metrics
    await page.evaluate(() => {
        const now = new Date().toISOString();
        const mockAttempts = [
            { taskId: 'm1', subject: 'Математика', correct: true, timestamp: now },
            { taskId: 'm2', subject: 'Математика', correct: true, timestamp: now },
            { taskId: 'm3', subject: 'Математика', correct: true, timestamp: now },
            { taskId: 'p1', subject: 'Физика', correct: true, timestamp: now },
            { taskId: 'p2', subject: 'Физика', correct: true, timestamp: now },
            { taskId: 'e1', subject: 'Английский', correct: true, timestamp: now }
        ];
        localStorage.setItem('studyMetrics', JSON.stringify(mockAttempts));
        if (window.refreshProfileExperience) {
            window.refreshProfileExperience();
        }
    });
    
    await page.waitForTimeout(300);
    await card.screenshot({ path: 'scratch/chart-current-populated.png' });
    
    await browser.close();
    console.log('Screenshots captured successfully');
})();
