const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    await page.addInitScript(() => {
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

    await page.goto('http://127.0.0.1:4400/profile.html', { waitUntil: 'networkidle' });
    const card = page.locator('.diagnostic-card').first();

    // Option 1: Solid Pie centered + legend below
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
                border: 2px solid var(--line) !important;
                box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
            }
            .chart-legend {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
                gap: 0.75rem 1rem !important;
            }
            .legend-item {
                display: inline-flex !important;
                align-items: center !important;
                gap: 0.5rem !important;
                font-size: 0.85rem !important;
                background: rgba(255, 255, 255, 0.04) !important;
                border: 1px solid var(--line) !important;
                padding: 0.4rem 0.85rem !important;
                border-radius: 9999px !important;
            }
            .legend-count {
                font-family: var(--f-mono) !important;
                font-weight: 700 !important;
                color: var(--ink) !important;
                background: rgba(255, 255, 255, 0.08) !important;
                padding: 0.1rem 0.45rem !important;
                border-radius: 9999px !important;
                font-size: 0.78rem !important;
                margin-left: 0.25rem !important;
            }
        `
    });
    await card.screenshot({ path: 'scratch/design-1-solid.png' });

    // Option 2: Donut cutout
    await page.addStyleTag({
        content: `
            .subject-chart {
                position: relative !important;
                display: grid !important;
                place-items: center !important;
            }
            .subject-chart::after {
                content: '' !important;
                position: absolute !important;
                inset: 30px !important;
                background: var(--surface-card) !important;
                border-radius: 50% !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5) !important;
            }
        `
    });
    await card.screenshot({ path: 'scratch/design-2-donut.png' });

    await browser.close();
    console.log('Saved design comparisons');
})();
