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

    await page.addStyleTag({
        content: `
            .chart-card-inner {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 1.75rem !important;
                flex: 1 !important;
                text-align: center !important;
                width: 100% !important;
            }
            .subject-chart {
                width: 180px !important;
                height: 180px !important;
                border-radius: 50% !important;
                margin: 0 auto !important;
                border: 2px solid rgba(255, 255, 255, 0.08) !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 240, 255, 0.05) !important;
                transition: transform var(--t-smooth) !important;
            }
            .subject-chart:hover {
                transform: scale(1.03) !important;
            }
            .chart-legend-wrap {
                width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
            }
            .chart-legend {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 0.6rem 0.75rem !important;
                width: 100% !important;
            }
            .legend-item {
                display: inline-flex !important;
                align-items: center !important;
                gap: 0.5rem !important;
                font-size: 0.82rem !important;
                font-weight: 600 !important;
                color: var(--ink) !important;
                background: rgba(255, 255, 255, 0.03) !important;
                border: 1px solid var(--line) !important;
                padding: 0.35rem 0.75rem !important;
                border-radius: 9999px !important;
                white-space: nowrap !important;
                transition: background var(--t-fast), border-color var(--t-fast) !important;
            }
            .legend-item:hover {
                background: rgba(255, 255, 255, 0.06) !important;
                border-color: var(--line-active) !important;
            }
            .legend-color, .legend-swatch {
                width: 10px !important;
                height: 10px !important;
                border-radius: 50% !important;
                display: inline-block !important;
                flex-shrink: 0 !important;
                margin-right: 0 !important;
            }
            .legend-count {
                font-family: var(--f-mono) !important;
                font-weight: 700 !important;
                color: var(--ink) !important;
                background: rgba(255, 255, 255, 0.07) !important;
                padding: 0.1rem 0.45rem !important;
                border-radius: 9999px !important;
                font-size: 0.75rem !important;
                margin-left: 0.25rem !important;
            }
            .chart-empty {
                font-size: 0.88rem !important;
                color: var(--muted) !important;
                text-align: center !important;
                margin: 0 !important;
            }
        `
    });

    const row = page.locator('.diagnostic-row');
    await row.screenshot({ path: 'scratch/diagnostic-row-comparison.png' });
    await browser.close();
    console.log('Saved diagnostic-row-comparison.png');
})();
