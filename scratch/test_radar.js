const { chromium } = require('F:/Varia/Programming/study_site/node_modules/playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://127.0.0.1:4400/profile.html');
    await page.waitForSelector('#skills-radar');

    // Inspect computed style of grid line, area, label, value
    const gridFill = await page.evaluate(() => {
        const line = document.querySelector('.skills-grid-line');
        return line ? window.getComputedStyle(line).fill : 'none';
    });
    console.log('skills-grid-line fill:', gridFill);

    const labelFill = await page.evaluate(() => {
        const label = document.querySelector('.skills-label');
        return label ? window.getComputedStyle(label).fill : 'none';
    });
    console.log('skills-label fill:', labelFill);

    const valueFill = await page.evaluate(() => {
        const val = document.querySelector('.skills-value');
        return val ? window.getComputedStyle(val).fill : 'none';
    });
    console.log('skills-value fill:', valueFill);

    // Capture screenshot of radar module
    const radarElem = await page.locator('.diagnostic-card').nth(1);
    await radarElem.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-radar-fixed.png' });

    // Also test with some attempts data to see the active skills polygon
    await page.evaluate(() => {
        const testAttempts = [
            { subject: 'Математика', taskId: '/multiplication_tasks/1', correct: true, timestamp: new Date().toISOString() },
            { subject: 'Математика', taskId: '/equations_tasks/1', correct: true, timestamp: new Date().toISOString() },
            { subject: 'Математика', taskId: '/equations_tasks/2', correct: false, timestamp: new Date().toISOString() },
            { subject: 'Математика', taskId: '/fractions/1', correct: true, timestamp: new Date().toISOString() }
        ];
        localStorage.setItem('studyMetrics', JSON.stringify(testAttempts));
    });
    await page.reload();
    await page.waitForSelector('#skills-radar');

    const areaFill = await page.evaluate(() => {
        const area = document.querySelector('.skills-area');
        return area ? window.getComputedStyle(area).fill : 'none';
    });
    console.log('Active skills-area fill:', areaFill);

    const radarWithData = await page.locator('.diagnostic-card').nth(1);
    await radarWithData.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-radar-with-data.png' });

    await browser.close();
    console.log('Radar screenshots captured!');
})();
