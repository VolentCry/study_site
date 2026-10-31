const { chromium } = require('playwright');

(async () => {
    console.log('🚀 Starting verification: Display name on login & registration & settings...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    let passedTests = 0;
    let failedTests = 0;

    function assert(condition, testName) {
        if (condition) {
            console.log(`  ✅ [PASS] ${testName}`);
            passedTests++;
        } else {
            console.error(`  ❌ [FAIL] ${testName}`);
            failedTests++;
        }
    }

    try {
        const uniqueId = Date.now();
        const testUsername = `user_${uniqueId}`;
        const initialDisplayName = `Алексей Игнатьев ${uniqueId % 1000}`;
        const updatedDisplayName = `Алексей Смирнов ${uniqueId % 1000}`;
        const testPassword = 'Password123!';

        // 1. Open Index Page
        await page.goto('http://127.0.0.1:5000/index.html');
        await page.waitForLoadState('networkidle');

        // Make sure we are logged out
        await page.evaluate(async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
        });
        await page.reload();
        await page.waitForLoadState('networkidle');

        // 2. Open Auth Modal in Login mode
        const loginBtn = await page.$('.auth-header-btn:not(.is-logged-in), .unified-auth-btn');
        assert(loginBtn !== null, 'Auth button exists in header');
        await loginBtn.click();
        await page.waitForSelector('#auth-modal[open]', { timeout: 3000 });

        // 3. Verify display name field is NOT VISIBLE on Login tab
        const isDisplayNameVisibleOnLogin = await page.evaluate(() => {
            const el = document.getElementById('auth-field-display-name');
            if (!el) return false;
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetHeight > 0;
        });
        assert(!isDisplayNameVisibleOnLogin, 'Display name input is strictly hidden on Login tab');

        // 4. Switch to Register tab -> field should become visible
        await page.$eval('#auth-tab-register', el => el.click());
        await page.waitForTimeout(200);

        const isDisplayNameVisibleOnRegister = await page.evaluate(() => {
            const el = document.getElementById('auth-field-display-name');
            if (!el) return false;
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetHeight > 0;
        });
        assert(isDisplayNameVisibleOnRegister, 'Display name input is visible on Registration tab');

        // 5. Switch back to Login tab -> field should hide again
        await page.$eval('#auth-tab-login', el => el.click());
        await page.waitForTimeout(200);

        const isDisplayNameHiddenAgain = await page.evaluate(() => {
            const el = document.getElementById('auth-field-display-name');
            const style = window.getComputedStyle(el);
            return style.display === 'none' || el.offsetHeight === 0;
        });
        assert(isDisplayNameHiddenAgain, 'Display name input hides again when switching back to Login tab');

        // 6. Perform Registration on Register tab with custom display name
        await page.$eval('#auth-tab-register', el => el.click());
        await page.fill('#auth-input-username', testUsername);
        await page.fill('#auth-input-display-name', initialDisplayName);
        await page.fill('#auth-input-password', testPassword);
        await page.$eval('#auth-form', form => form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })));

        await page.waitForTimeout(1000);

        // Verify registration success & display name
        const authUserAfterReg = await page.evaluate(() => {
            return window.AuthSync ? window.AuthSync.getUser() : null;
        });
        assert(authUserAfterReg && authUserAfterReg.displayName === initialDisplayName, `Registered user has display name "${initialDisplayName}"`);

        // 7. Log out
        await page.evaluate(async () => {
            await window.AuthSync.logout();
        });
        await page.waitForTimeout(400);

        // Simulate guest state in localStorage
        await page.evaluate(() => {
            localStorage.setItem('studyUserName', 'Ученик');
            localStorage.setItem('loggedInUser', 'Ученик');
        });

        // 8. Open Login modal
        await page.evaluate(() => {
            window.AuthSync.openModal('login');
        });
        await page.waitForSelector('#auth-modal[open]', { timeout: 3000 });

        const displayNameVisibleOnSecondLogin = await page.evaluate(() => {
            const el = document.getElementById('auth-field-display-name');
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && el.offsetHeight > 0;
        });
        assert(!displayNameVisibleOnSecondLogin, 'Display name is NOT asked on login form');

        // Fill login credentials (only username & password)
        await page.fill('#auth-input-username', testUsername);
        await page.fill('#auth-input-password', testPassword);
        await page.$eval('#auth-form', form => form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })));

        await page.waitForTimeout(1000);

        // Check that user display name from registration is restored upon login!
        const authUserAfterLogin = await page.evaluate(() => {
            return window.AuthSync ? window.AuthSync.getUser() : null;
        });
        assert(authUserAfterLogin && authUserAfterLogin.displayName === initialDisplayName, `After login, display name is restored from DB: "${authUserAfterLogin?.displayName}"`);

        // 9. Navigate to profile.html and verify identity HUD
        await page.goto('http://127.0.0.1:5000/profile.html');
        await page.waitForLoadState('networkidle');

        const profileName = await page.$eval('#profile-nickname', el => el.textContent.trim());
        assert(profileName === initialDisplayName, `Profile HUD displays registration name "${profileName}"`);

        // 10. Open settings in profile.html and change display name
        await page.$eval('#settings-open-btn', btn => btn.click());
        await page.waitForSelector('#settings-dialog[open]', { timeout: 3000 });

        // Switch to custom pane if not active
        await page.fill('#settings-name-input', updatedDisplayName);
        await page.$eval('#settings-name-save-btn', btn => btn.click());
        await page.waitForTimeout(600);

        // Verify profile HUD updated
        const profileNameAfterEdit = await page.$eval('#profile-nickname', el => el.textContent.trim());
        assert(profileNameAfterEdit === updatedDisplayName, `Profile HUD updated after settings edit to "${profileNameAfterEdit}"`);

        // Verify backend DB received updated name
        const backendUser = await page.evaluate(async () => {
            const res = await fetch('/api/auth/me');
            return await res.json();
        });
        assert(backendUser.user && backendUser.user.displayName === updatedDisplayName, `Database has updated display name "${backendUser.user?.displayName}"`);

        // 11. Log out and Log back in -> verify updated name from settings is loaded!
        await page.evaluate(async () => {
            await window.AuthSync.logout();
        });
        await page.waitForTimeout(400);

        // Log in again
        await page.evaluate(() => {
            window.AuthSync.openModal('login');
        });
        await page.waitForSelector('#auth-modal[open]', { timeout: 3000 });

        await page.fill('#auth-input-username', testUsername);
        await page.fill('#auth-input-password', testPassword);
        await page.$eval('#auth-form', form => form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })));
        await page.waitForTimeout(1000);

        const finalUser = await page.evaluate(() => window.AuthSync.getUser());
        assert(finalUser && finalUser.displayName === updatedDisplayName, `On subsequent login, display name matches settings update: "${finalUser?.displayName}"`);

        console.log(`\n========================================`);
        console.log(`Results: ${passedTests} passed, ${failedTests} failed`);
        console.log(`========================================`);

    } catch (e) {
        console.error('Fatal test error:', e);
        failedTests++;
    } finally {
        await browser.close();
        process.exit(failedTests > 0 ? 1 : 0);
    }
})();
