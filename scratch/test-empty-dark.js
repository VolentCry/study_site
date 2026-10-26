const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://127.0.0.1:4400/profile.html', { waitUntil: 'networkidle' });
    
    await page.addStyleTag({
        content: `
            .chart-card-inner {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 1.5rem !important;
                flex: 1 !important;
                text-align: center !important;
            }
            .subject-chart {
                width: 170px !important;
                height: 170px !important;
                border-radius: 50% !important;
                margin: 0 auto !important;
                border: 2px dashed rgba(255, 255, 255, 0.15) !important;
                box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
                background: conic-gradient(rgba(255, 255, 255, 0.08) 0% 100%) !important;
            }
            .chart-empty {
                font-size: 0.88rem !important;
                color: var(--muted) !important;
                text-align: center !important;
                margin: 0 !important;
            }
        `
    });
    
    const card = page.locator('.diagnostic-card').first();
    await card.screenshot({ path: 'scratch/empty-dark-state.png' });
    await browser.close();
    console.log('Saved empty-dark-state.png');
})();
