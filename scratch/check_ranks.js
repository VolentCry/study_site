const { chromium } = require('F:/Varia/Programming/study_site/node_modules/playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://127.0.0.1:4400/profile.html#ranks');
    await page.waitForSelector('.trainer-ranks-summary');
    const summaryBox = await page.locator('.trainer-ranks-summary').boundingBox();
    console.log('Summary box:', summaryBox);
    const items = await page.locator('.trainer-summary-item').all();
    for (let i = 0; i < items.length; i++) {
        const box = await items[i].boundingBox();
        const text = await items[i].innerText();
        console.log(`Item ${i}: x=${box.x.toFixed(0)}, y=${box.y.toFixed(0)}, w=${box.w ? box.w.toFixed(0) : box.width.toFixed(0)}, h=${box.h ? box.h.toFixed(0) : box.height.toFixed(0)} | ${text.replace(/\n/g, ' ')}`);
    }
    const card0 = await page.locator('.trainer-item-card').first().boundingBox();
    console.log(`Card 0: x=${card0.x.toFixed(0)}, y=${card0.y.toFixed(0)}, w=${card0.width.toFixed(0)}, h=${card0.height.toFixed(0)}`);
    await page.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-ranks-view.png', fullPage: true });
    await browser.close();
    console.log('Screenshot updated!');
})();
