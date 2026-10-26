const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 1. Test empty state
    await page.goto('http://127.0.0.1:4400/profile.html', { waitUntil: 'networkidle' });
    
    const emptyMetrics = await page.evaluate(() => {
        const inner = document.querySelector('.chart-card-inner').getBoundingClientRect();
        const chart = document.getElementById('subject-chart').getBoundingClientRect();
        const emptyMsg = document.getElementById('chart-empty').getBoundingClientRect();
        
        const innerCenter = inner.left + inner.width / 2;
        const chartCenter = chart.left + chart.width / 2;
        const msgCenter = emptyMsg.left + emptyMsg.width / 2;
        
        return {
            innerCenter,
            chartCenter,
            chartOffset: Math.abs(innerCenter - chartCenter),
            chartY: chart.top,
            chartBottom: chart.bottom,
            msgY: emptyMsg.top,
            isMsgBelow: emptyMsg.top >= chart.bottom,
            msgOffset: Math.abs(innerCenter - msgCenter)
        };
    });
    console.log('Empty State Metrics:', JSON.stringify(emptyMetrics, null, 2));

    const card = page.locator('.diagnostic-card').first();
    await card.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-subject-chart-empty.png' });

    // 2. Test populated state
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
    });
    
    await page.reload({ waitUntil: 'networkidle' });

    const populatedMetrics = await page.evaluate(() => {
        const inner = document.querySelector('.chart-card-inner').getBoundingClientRect();
        const chart = document.getElementById('subject-chart').getBoundingClientRect();
        const legend = document.getElementById('chart-legend').getBoundingClientRect();
        
        const innerCenter = inner.left + inner.width / 2;
        const chartCenter = chart.left + chart.width / 2;
        const legendCenter = legend.left + legend.width / 2;
        
        return {
            innerCenter,
            chartCenter,
            chartOffset: Math.abs(innerCenter - chartCenter),
            chartY: chart.top,
            chartBottom: chart.bottom,
            legendY: legend.top,
            isLegendBelow: legend.top >= chart.bottom,
            legendOffset: Math.abs(innerCenter - legendCenter),
            legendItemsCount: document.querySelectorAll('.legend-item').length
        };
    });
    console.log('Populated State Metrics:', JSON.stringify(populatedMetrics, null, 2));

    await card.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-subject-chart-populated.png' });
    
    // Screenshot whole diagnostic section
    const diagnosticRow = page.locator('.diagnostic-row');
    await diagnosticRow.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-diagnostic-row.png' });

    // 3. Test mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(100);
    await card.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-subject-chart-mobile.png' });

    console.log('Console Errors:', consoleErrors);
    await browser.close();
})();
