const { chromium } = require('F:/Varia/Programming/study_site/node_modules/playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://127.0.0.1:4400/profile.html#ranks');
    await page.waitForSelector('.trainer-ranks-summary');
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log('Mobile horizontal overflow:', hasOverflow);
    const items = await page.locator('.trainer-summary-item').all();
    for (let i = 0; i < items.length; i++) {
        const box = await items[i].boundingBox();
        console.log(`Mobile Item ${i}: x=${box.x.toFixed(0)}, y=${box.y.toFixed(0)}, w=${box.width.toFixed(0)}, h=${box.height.toFixed(0)}`);
    }
    await page.screenshot({ path: 'C:/Users/semen/.gemini/antigravity-cli/brain/e807b1fb-6b93-41e6-b7f0-1a00f2c2c46b/profile-ranks-mobile.png', fullPage: true });
    await browser.close();
    console.log('Mobile screenshot updated!');
})();
