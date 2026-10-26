const fs = require('fs');
let code = fs.readFileSync('js/profile_metrics.js', 'utf8');

const oldBlock = `        chart.style.background = total
            ? \`conic-gradient(\${segments.join(', ')})\`
            : 'conic-gradient(#d5dce5 0% 100%)';`;

const newBlock = `        chart.style.background = total
            ? \`conic-gradient(\${segments.join(', ')})\`
            : 'conic-gradient(rgba(255, 255, 255, 0.08) 0% 100%)';
        chart.classList.toggle('empty', total === 0);`;

// Normalize line endings for replacement
const isCRLF = code.includes('\r\n');
const normalizedCode = code.replace(/\r\n/g, '\n');

if (normalizedCode.includes(oldBlock)) {
    const updated = normalizedCode.replace(oldBlock, newBlock);
    fs.writeFileSync('js/profile_metrics.js', isCRLF ? updated.replace(/\n/g, '\r\n') : updated, 'utf8');
    console.log('Successfully updated js/profile_metrics.js');
} else {
    console.error('Target not found in js/profile_metrics.js');
}
