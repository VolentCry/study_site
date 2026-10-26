const fs = require('fs');

let html = fs.readFileSync('profile.html', 'utf8');

const isCRLF = html.includes('\r\n');
let norm = html.replace(/\r\n/g, '\n');

// 1. Update CSS
const oldCss = `        /* SUBJECT DONUT CHART */
        .chart-card-inner {
            display: flex;
            align-items: center;
            gap: 2rem;
            flex: 1;
        }

        .subject-chart {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            flex-shrink: 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            border: 1px solid var(--line);
        }

        .chart-legend {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex: 1;
        }

        .legend-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            font-size: 0.82rem;
        }

        .legend-color, .legend-swatch {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 0.45rem;
            flex-shrink: 0;
        }

        .legend-count {
            font-family: var(--f-mono);
            font-weight: 700;
            color: var(--ink);
            margin-left: auto;
        }

        .chart-empty {
            font-size: 0.85rem;
            color: var(--muted);
            font-style: italic;
        }`;

const newCss = `        /* SUBJECT DONUT CHART */
        .chart-card-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.75rem;
            flex: 1;
            width: 100%;
            text-align: center;
        }

        .subject-chart {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            margin: 0 auto;
            border: 2px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 240, 255, 0.05);
            transition: transform var(--t-smooth);
            flex-shrink: 0;
        }

        .subject-chart:hover {
            transform: scale(1.03);
        }

        .subject-chart.empty {
            border: 2px dashed rgba(255, 255, 255, 0.15);
            box-shadow: none;
        }

        .chart-legend-wrap {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .chart-legend {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 0.6rem 0.75rem;
            width: 100%;
        }

        .legend-item {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.82rem;
            font-weight: 600;
            color: var(--ink);
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--line);
            padding: 0.35rem 0.75rem;
            border-radius: var(--r-pill);
            white-space: nowrap;
            transition: background var(--t-fast), border-color var(--t-fast);
        }

        .legend-item:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: var(--line-active);
        }

        .legend-color, .legend-swatch {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 0;
            flex-shrink: 0;
        }

        .legend-count {
            font-family: var(--f-mono);
            font-weight: 700;
            color: var(--ink);
            background: rgba(255, 255, 255, 0.08);
            padding: 0.1rem 0.45rem;
            border-radius: var(--r-pill);
            font-size: 0.75rem;
            margin-left: 0.25rem;
        }

        .chart-empty {
            font-size: 0.88rem;
            color: var(--muted);
            text-align: center;
            margin: 0;
        }`;

// 2. Update HTML
const oldHtml = `                    <div class="chart-card-inner">
                        <div id="subject-chart" class="subject-chart" role="img" aria-label="Круговая диаграмма решённых задач по предметам"></div>
                        <div>
                            <div id="chart-legend" class="chart-legend"></div>
                            <p id="chart-empty" class="chart-empty hidden">Пока нет решённых задач за эту неделю.</p>
                        </div>
                    </div>`;

const newHtml = `                    <div class="chart-card-inner">
                        <div id="subject-chart" class="subject-chart empty" role="img" aria-label="Круговая диаграмма решённых задач по предметам"></div>
                        <div class="chart-legend-wrap">
                            <div id="chart-legend" class="chart-legend"></div>
                            <p id="chart-empty" class="chart-empty hidden">Пока нет решённых задач за эту неделю.</p>
                        </div>
                    </div>`;

if (!norm.includes(oldCss)) {
    console.error('Could not find oldCss in profile.html');
    process.exit(1);
}

if (!norm.includes(oldHtml)) {
    console.error('Could not find oldHtml in profile.html');
    process.exit(1);
}

norm = norm.replace(oldCss, newCss);
norm = norm.replace(oldHtml, newHtml);

fs.writeFileSync('profile.html', isCRLF ? norm.replace(/\n/g, '\r\n') : norm, 'utf8');
console.log('Successfully updated profile.html');
