/**
 * Educational Platform «Знания» - Auth & Cloud Synchronization Module
 * Handles user authentication (login/register/logout), signed session cookies,
 * and robust progress synchronization with the SQLite backend.
 * Compatible with PythonAnywhere free tier constraints (512MB quota).
 */

(function () {
    'use strict';

    // Guard against multiple inclusions
    if (window.AuthSync) return;

    const API_BASE = '/api';
    const SYNC_DEBOUNCE_MS = 2500;
    let syncTimer = null;
    let currentUser = null;

    // --- Unified Global Theme Controller ---
    const StudyTheme = {
        get() {
            try {
                return localStorage.getItem('profileTheme') || localStorage.getItem('site_theme') || 'dark';
            } catch (e) {
                return 'dark';
            }
        },
        set(th, sync = true) {
            const theme = th === 'light' ? 'light' : 'dark';
            try {
                localStorage.setItem('profileTheme', theme);
                localStorage.setItem('site_theme', theme);
            } catch (e) {}
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.dataset.theme = theme;
            window.dispatchEvent(new CustomEvent('study-theme-changed', { detail: theme }));
            if (sync && currentUser) {
                scheduleSync(80);
            }
            return theme;
        },
        toggle(sync = true) {
            const next = this.get() === 'dark' ? 'light' : 'dark';
            return this.set(next, sync);
        }
    };
    window.StudyTheme = StudyTheme;

    // Immediately apply theme on script load
    try {
        const curThemeOnLoad = StudyTheme.get();
        document.documentElement.setAttribute('data-theme', curThemeOnLoad);
        document.documentElement.dataset.theme = curThemeOnLoad;
    } catch(e) {}

    let isInitialized = false;

    // --- 1. CSS STYLES FOR AUTH MODAL & HEADER BADGE ---
    const AUTH_STYLES = `
        /* Cloud Auth Dialog */
        .auth-dialog .hidden,
        .auth-dialog [hidden],
        .auth-field.hidden,
        .auth-progress-save-hint.hidden,
        .auth-error-box.hidden {
            display: none !important;
        }
        .auth-dialog {
            border: 1px solid var(--line, rgba(255, 255, 255, 0.15));
            border-radius: var(--r-lg, 24px);
            background: var(--surface-card, #151b2b);
            color: var(--ink, #f8fafc);
            padding: 0;
            max-width: 440px;
            width: calc(100% - 32px);
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
            margin: auto;
            overflow: hidden;
            font-family: var(--f-body, system-ui, sans-serif);
        }
        .auth-dialog::backdrop {
            background: rgba(5, 8, 15, 0.78);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        .auth-card {
            padding: 28px 24px 24px 24px;
            display: flex;
            flex-direction: column;
            gap: 18px;
        }
        .auth-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            position: relative;
        }
        .auth-title-group h2 {
            font-family: var(--f-display, system-ui, sans-serif);
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--ink, #fff);
            margin: 0 0 4px 0;
            letter-spacing: -0.02em;
        }
        .auth-title-group p {
            font-size: 0.85rem;
            color: var(--muted, #94a3b8);
            margin: 0;
            line-height: 1.4;
        }
        .auth-close-btn {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid var(--line, rgba(255, 255, 255, 0.12));
            color: var(--muted, #94a3b8);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s ease;
        }
        .auth-close-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            color: var(--ink, #fff);
            transform: scale(1.05);
        }
        /* Mode Switch Tabs */
        .auth-tabs {
            display: flex;
            background: rgba(0, 0, 0, 0.25);
            border: 1px solid var(--line, rgba(255, 255, 255, 0.08));
            border-radius: var(--r-pill, 9999px);
            padding: 4px;
            gap: 4px;
        }
        .auth-tab-btn {
            flex: 1;
            padding: 8px 14px;
            font-size: 0.85rem;
            font-weight: 700;
            border: none;
            border-radius: var(--r-pill, 9999px);
            background: transparent;
            color: var(--muted, #94a3b8);
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
        }
        .auth-tab-btn.active {
            background: var(--accent, #ff7728);
            color: #ffffff;
            box-shadow: 0 2px 10px var(--accent-glow, rgba(255, 119, 40, 0.3));
        }
        /* Form fields */
        .auth-form {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
        .auth-field {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .auth-label {
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--ink, #fff);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .auth-input-wrap {
            position: relative;
            display: flex;
            align-items: center;
        }
        .auth-input {
            width: 100%;
            padding: 10px 14px;
            padding-right: 42px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--line, rgba(255, 255, 255, 0.15));
            border-radius: var(--r-sm, 8px);
            color: var(--ink, #fff);
            font-family: inherit;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .auth-input:focus {
            border-color: var(--accent, #ff7728);
            box-shadow: 0 0 0 3px var(--accent-glow, rgba(255, 119, 40, 0.2));
        }
        .auth-pwd-toggle {
            position: absolute;
            right: 8px;
            background: transparent;
            border: none;
            color: var(--muted, #94a3b8);
            padding: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            border-radius: 4px;
            transition: color 0.15s;
        }
        .auth-pwd-toggle:hover {
            color: var(--ink, #fff);
        }
        /* Notice block */
        .auth-progress-save-hint {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: rgba(16, 185, 129, 0.12);
            border: 1px solid rgba(16, 185, 129, 0.25);
            border-radius: var(--r-sm, 8px);
            font-size: 0.8rem;
            color: #34d399;
            line-height: 1.35;
        }
        .auth-error-box {
            padding: 10px 12px;
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: var(--r-sm, 8px);
            font-size: 0.82rem;
            color: #f87171;
            line-height: 1.4;
        }
        .auth-submit-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 12px 18px;
            background: var(--accent, #ff7728);
            color: #ffffff;
            border: none;
            border-radius: var(--r-pill, 9999px);
            font-size: 0.95rem;
            font-weight: 700;
            font-family: inherit;
            cursor: pointer;
            box-shadow: 0 4px 16px var(--accent-glow, rgba(255, 119, 40, 0.35));
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            margin-top: 6px;
        }
        .auth-submit-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            filter: brightness(1.08);
            box-shadow: 0 6px 22px var(--accent-glow, rgba(255, 119, 40, 0.45));
        }
        .auth-submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        /* Header Auth Trigger Badge */
        .auth-header-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            height: 40px;
            box-sizing: border-box;
            padding: 0 14px;
            font-size: 0.85rem;
            line-height: 1;
            font-weight: 700;
            font-family: var(--f-body, system-ui, sans-serif);
            border-radius: var(--r-pill, 9999px);
            border: 1px solid var(--line, rgba(255, 255, 255, 0.15));
            background: rgba(255, 255, 255, 0.05);
            color: var(--ink, #f8fafc);
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            white-space: nowrap;
        }
        .auth-header-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--accent, #ff7728);
            transform: translateY(-1px);
        }
        .auth-header-btn.is-logged-in {
            border-color: rgba(16, 185, 129, 0.35);
            background: rgba(16, 185, 129, 0.08);
        }
        .auth-header-btn.is-logged-in:hover {
            border-color: rgba(16, 185, 129, 0.6);
            background: rgba(16, 185, 129, 0.15);
        }
        .auth-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #94a3b8;
            transition: background 0.2s;
        }
        .auth-header-btn.is-logged-in .auth-status-dot {
            background: #10b981;
            box-shadow: 0 0 8px #10b981;
        }
        /* Unified Profile & Auth Dropdown & Styles */
        .unified-auth-wrap {
            position: relative;
            display: inline-flex;
            align-items: center;
        }
        .profile-cta.is-logged-in,
        .profile-link.is-logged-in,
        .nav-profile-link.is-logged-in,
        .nav-profile-btn.is-logged-in,
        .auth-header-btn.is-logged-in {
            border-color: rgba(16, 185, 129, 0.45) !important;
            background: rgba(16, 185, 129, 0.08) !important;
            color: var(--ink, #f8fafc) !important;
        }
        .profile-cta.is-logged-in:hover,
        .profile-link.is-logged-in:hover,
        .nav-profile-link.is-logged-in:hover,
        .nav-profile-btn.is-logged-in:hover,
        .auth-header-btn.is-logged-in:hover {
            border-color: rgba(16, 185, 129, 0.75) !important;
            background: rgba(16, 185, 129, 0.16) !important;
            box-shadow: 0 4px 18px rgba(16, 185, 129, 0.25) !important;
        }
                .auth-dropdown-caret {
            width: 12px;
            height: 12px;
            stroke: currentColor;
            opacity: 0.75;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
            flex-shrink: 0;
            display: inline-block;
            vertical-align: middle;
            margin-left: 3px;
        }
        .unified-auth-wrap:hover .auth-dropdown-caret,
        .unified-auth-wrap.is-open .auth-dropdown-caret {
            transform: rotate(180deg);
            opacity: 1;
        }
        .auth-dropdown-menu {
            display: block;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            min-width: 220px;
            background: var(--surface-card, #151b2b);
            border: 1px solid var(--line, rgba(255, 255, 255, 0.15));
            border-radius: var(--r, 14px);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
            padding: 8px;
            z-index: 10000;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            transform: translateY(-4px);
            transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 0.18s cubic-bezier(0.16, 1, 0.3, 1);
            transition-delay: 0.2s;
        }
        /* Invisible hover bridge to eliminate dead zone between button and dropdown */
        .auth-dropdown-menu::before {
            content: '';
            position: absolute;
            top: -18px;
            left: -20px;
            right: -20px;
            height: 20px;
            background: transparent;
            pointer-events: auto;
        }
        .unified-auth-wrap:hover .auth-dropdown-menu,
        .unified-auth-wrap:focus-within .auth-dropdown-menu,
        .unified-auth-wrap.is-open .auth-dropdown-menu {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateY(0);
            transition-delay: 0s;
        }
        @media (max-width: 768px) {
            .auth-dropdown-menu {
                display: none !important;
            }
        }
        .auth-dropdown-header {
            padding: 8px 10px 10px;
            border-bottom: 1px solid var(--line, rgba(255, 255, 255, 0.1));
            margin-bottom: 6px;
        }
        .auth-dropdown-user {
            font-weight: 700;
            font-size: 0.95rem;
            color: var(--ink, #ffffff);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .auth-dropdown-role {
            font-size: 0.78rem;
            color: var(--muted, #94a3b8);
        }
        .auth-dropdown-item {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 8px 10px;
            border-radius: 8px;
            font-size: 0.88rem;
            font-weight: 600;
            color: var(--ink, #f8fafc);
            text-decoration: none;
            background: none;
            border: none;
            cursor: pointer;
            text-align: left;
            transition: background 0.15s, color 0.15s;
            font-family: inherit;
            box-sizing: border-box;
        }
        .auth-dropdown-item:hover {
            background: rgba(255, 255, 255, 0.08);
            color: var(--accent, #ff7728);
        }
        .auth-dropdown-logout-btn {
            color: var(--danger, #ff4757) !important;
            border-top: 1px solid var(--line, rgba(255, 255, 255, 0.08)) !important;
            margin-top: 4px;
            padding-top: 10px;
        }
        .auth-dropdown-logout-btn:hover {
            background: rgba(255, 71, 87, 0.12) !important;
            color: #ff6b81 !important;
        }
        .auth-guest-link-row {
            text-align: center;
            margin-top: 14px;
            padding-top: 12px;
            border-top: 1px solid var(--line, rgba(255, 255, 255, 0.1));
        }
        .auth-guest-link {
            color: var(--muted, #94a3b8);
            font-size: 0.85rem;
            text-decoration: underline;
            text-underline-offset: 3px;
            transition: color 0.2s;
        }
        .auth-guest-link:hover {
            color: var(--ink, #ffffff);
        }
        /* Sync Toast Notification */
        .auth-sync-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 18px;
            border-radius: var(--r, 16px);
            background: var(--surface-card, #151b2b);
            border: 1px solid var(--line, rgba(255, 255, 255, 0.15));
            color: var(--ink, #fff);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
            font-size: 0.85rem;
            font-weight: 600;
            font-family: var(--f-body, system-ui, sans-serif);
            opacity: 0;
            transform: translateY(15px);
            pointer-events: none;
            transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .auth-sync-toast.show {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        .auth-sync-toast.success {
            border-color: rgba(16, 185, 129, 0.4);
        }
        .auth-sync-toast.error {
            border-color: rgba(239, 68, 68, 0.4);
        }

        /* Standalone button styles for modals across all pages */
        .settings-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 16px;
            border-radius: var(--r-sm, 8px);
            font-size: 0.88rem;
            font-weight: 700;
            font-family: inherit;
            cursor: pointer;
            border: none;
            text-decoration: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            box-sizing: border-box;
        }
        .settings-btn:hover {
            transform: translateY(-1px);
        }
        .settings-btn-primary {
            background: var(--accent, #ff7728);
            color: #ffffff !important;
            box-shadow: 0 4px 14px var(--accent-glow, rgba(255, 119, 40, 0.3));
        }
        .settings-btn-primary:hover {
            filter: brightness(1.1);
        }
        .settings-btn-accent {
            background: var(--accent-cyan, #2ce6d6);
            color: #090c13 !important;
        }
        .settings-btn-accent:hover {
            filter: brightness(1.1);
        }
        .settings-btn-secondary {
            background: rgba(255, 255, 255, 0.08);
            color: var(--ink, #f8fafc) !important;
            border: 1px solid var(--line, rgba(255, 255, 255, 0.15));
        }
        .settings-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.14);
        }
        .settings-btn-danger {
            background: rgba(239, 68, 68, 0.15);
            color: #f87171 !important;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .settings-btn-danger:hover {
            background: #ef4444;
            color: #ffffff !important;
        }

        /* Light Mode Specific Overrides */
        [data-theme="light"] .auth-dialog {
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08);
        }
        [data-theme="light"] .auth-dialog::backdrop {
            background: rgba(15, 23, 42, 0.5);
        }
        [data-theme="light"] .auth-tabs {
            background: #f1f5f9;
            border-color: rgba(15, 23, 42, 0.12);
        }
        [data-theme="light"] .auth-close-btn {
            background: rgba(15, 23, 42, 0.05);
            border-color: rgba(15, 23, 42, 0.1);
            color: #475569;
        }
        [data-theme="light"] .auth-close-btn:hover {
            background: rgba(15, 23, 42, 0.1);
            color: #0f172a;
        }
        [data-theme="light"] .auth-input {
            background: #f8fafc;
            border-color: rgba(15, 23, 42, 0.18);
            color: #0f172a;
        }
        [data-theme="light"] .auth-header-btn {
            background: rgba(15, 23, 42, 0.05);
            border-color: rgba(15, 23, 42, 0.15);
            color: #0f172a;
        }
        [data-theme="light"] .auth-header-btn:hover {
            background: rgba(15, 23, 42, 0.1);
        }
        [data-theme="light"] .auth-header-btn.is-logged-in {
            background: rgba(5, 150, 105, 0.08);
            border-color: rgba(5, 150, 105, 0.25);
            color: #065f46;
        }
        [data-theme="light"] .settings-btn-secondary {
            background: #e2e8f0;
            color: #0f172a;
            border: 1px solid rgba(15, 23, 42, 0.15);
        }
        [data-theme="light"] .settings-btn-secondary:hover {
            background: #cbd5e1;
        }
    `;

    // --- 2. LOCAL STORAGE HARVESTING & APPLICATION ---
    function collectLocalState() {
        let metrics = [];
        try {
            const raw = localStorage.getItem('studyMetrics');
            metrics = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(metrics)) metrics = [];
        } catch (e) {
            metrics = [];
        }

        let trainerRecords = {};
        try {
            if (window.TrainerTracker && typeof window.TrainerTracker.getTrainerRecords === 'function') {
                trainerRecords = window.TrainerTracker.getTrainerRecords();
            } else {
                const raw = localStorage.getItem('studyTrainerRecords');
                trainerRecords = raw ? JSON.parse(raw) : {};
            }
        } catch (e) {
            trainerRecords = {};
        }

        let claimedGifts = {};
        try {
            const raw = localStorage.getItem('studyClaimedTrainerGifts');
            claimedGifts = raw ? JSON.parse(raw) : {};
        } catch (e) {
            claimedGifts = {};
        }

        const totalSolvedTasks = parseInt(localStorage.getItem('totalSolvedTasks') || '0', 10) || 0;
        const userXP = parseInt(localStorage.getItem('user_xp') || '0', 10) || 0;
        const bonusXp = parseInt(localStorage.getItem('studyBonusXp') || '0', 10) || 0;
        const avatarFrame = localStorage.getItem('profileAvatarFrame') || 'orbit';
        const theme = localStorage.getItem('profileTheme') || 'dark';
        let userName = localStorage.getItem('studyUserName') || localStorage.getItem('loggedInUser');
        if ((!userName || userName === 'Ученик') && currentUser) {
            userName = currentUser.displayName || currentUser.username;
            try {
                localStorage.setItem('studyUserName', userName);
                localStorage.setItem('loggedInUser', userName);
            } catch(e) {}
        }
        if (!userName) userName = 'Ученик';

        return {
            userName,
            avatarFrame,
            userXP,
            bonusXp,
            totalSolvedTasks,
            theme,
            metrics,
            trainerRecords,
            claimedGifts
        };
    }

    function applyServerState(data) {
        if (!data || typeof data !== 'object') return;

        // Display name
        if (data.userName) {
            localStorage.setItem('studyUserName', String(data.userName).trim());
            localStorage.setItem('loggedInUser', String(data.userName).trim());
        }

        // Metrics (attempts array) - keep union / non-destructive
        if (Array.isArray(data.metrics) && data.metrics.length > 0) {
            try {
                const localRaw = localStorage.getItem('studyMetrics');
                const localMetrics = localRaw ? JSON.parse(localRaw) : [];
                if (data.metrics.length >= localMetrics.length) {
                    localStorage.setItem('studyMetrics', JSON.stringify(data.metrics));
                }
            } catch (e) {
                localStorage.setItem('studyMetrics', JSON.stringify(data.metrics));
            }
        }

        // Trainer records (max streak, level etc.)
        if (data.trainerRecords && typeof data.trainerRecords === 'object') {
            try {
                const localRaw = localStorage.getItem('studyTrainerRecords');
                const localRecords = localRaw ? JSON.parse(localRaw) : {};
                const merged = Object.assign({}, localRecords, data.trainerRecords);
                localStorage.setItem('studyTrainerRecords', JSON.stringify(merged));
            } catch (e) {
                localStorage.setItem('studyTrainerRecords', JSON.stringify(data.trainerRecords));
            }
        }

        // Claimed gifts
        if (data.claimedGifts && typeof data.claimedGifts === 'object') {
            try {
                const localRaw = localStorage.getItem('studyClaimedTrainerGifts');
                const localGifts = localRaw ? JSON.parse(localRaw) : {};
                const merged = Object.assign({}, localGifts, data.claimedGifts);
                localStorage.setItem('studyClaimedTrainerGifts', JSON.stringify(merged));
            } catch (e) {
                localStorage.setItem('studyClaimedTrainerGifts', JSON.stringify(data.claimedGifts));
            }
        }

        // Total solved tasks: take higher value
        const localSolved = parseInt(localStorage.getItem('totalSolvedTasks') || '0', 10) || 0;
        const serverSolved = parseInt(data.totalSolvedTasks || 0, 10);
        localStorage.setItem('totalSolvedTasks', String(Math.max(localSolved, serverSolved)));

        // User XP: take higher value
        const localXp = parseInt(localStorage.getItem('user_xp') || '0', 10) || 0;
        const serverXp = parseInt(data.userXP || 0, 10);
        localStorage.setItem('user_xp', String(Math.max(localXp, serverXp)));

        // Bonus XP: take higher value
        const localBonus = parseInt(localStorage.getItem('studyBonusXp') || '0', 10) || 0;
        const serverBonus = parseInt(data.bonusXp || 0, 10);
        localStorage.setItem('studyBonusXp', String(Math.max(localBonus, serverBonus)));

        // Avatar frame
        if (data.avatarFrame && typeof data.avatarFrame === 'string') {
            localStorage.setItem('profileAvatarFrame', data.avatarFrame);
        }

        // Theme
        if (data.theme && typeof data.theme === 'string') {
            const serverTh = data.theme === 'light' ? 'light' : 'dark';
            localStorage.setItem('profileTheme', serverTh);
            localStorage.setItem('site_theme', serverTh);
            document.documentElement.setAttribute('data-theme', serverTh);
            document.documentElement.dataset.theme = serverTh;
            window.dispatchEvent(new CustomEvent('study-theme-changed', { detail: serverTh }));
        }

        // Refresh UI components if functions exist
        if (typeof window.refreshProfileExperience === 'function') {
            window.refreshProfileExperience();
        }
        if (typeof window.applyStoredFrame === 'function') {
            window.applyStoredFrame();
        }
        if (typeof window.updateProfileIdentity === 'function') {
            window.updateProfileIdentity(data.userName);
        }
        if (typeof window.initProfileCharts === 'function') {
            window.initProfileCharts();
        }

        // Fire custom sync event
        window.dispatchEvent(new CustomEvent('study-cloud-synced', { detail: data }));
    }

    // --- 3. TOAST NOTIFICATIONS ---
    function showToast(message, type = 'success', duration = 3000) {
        let toast = document.getElementById('auth-sync-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'auth-sync-toast';
            toast.className = 'auth-sync-toast';
            document.body.appendChild(toast);
        }

        const icon = type === 'success' ? '☁️' : '⚠️';
        toast.className = `auth-sync-toast ${type} show`;
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

        clearTimeout(toast.__timer);
        toast.__timer = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // --- 4. API CLIENT CALLS ---
    async function apiCheckMe() {
        try {
            const res = await fetch(`${API_BASE}/auth/me`, { cache: 'no-store' });
            if (!res.ok) return { loggedIn: false };
            return await res.json();
        } catch (e) {
            return { loggedIn: false, error: e.message };
        }
    }

    async function apiRegister(username, password, displayName, localData) {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, displayName, localData })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Ошибка при регистрации');
        }
        return data;
    }

    async function apiLogin(username, password) {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Неверный логин или пароль');
        }
        return data;
    }

    async function apiLogout() {
        const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
        return await res.json();
    }

    async function apiGetUserData() {
        const res = await fetch(`${API_BASE}/user/data`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Не удалось загрузить данные');
        return data.data;
    }

    async function apiSaveUserData(payload) {
        const res = await fetch(`${API_BASE}/user/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка синхронизации');
        return data;
    }

    // --- 5. DOM MODAL INJECTION & LOGIC ---
    function ensureModalInDOM() {
        if (document.getElementById('auth-modal')) return;

        // Inject Styles
        if (!document.getElementById('auth-sync-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'auth-sync-styles';
            styleEl.textContent = AUTH_STYLES;
            document.head.appendChild(styleEl);
        }

        const dialog = document.createElement('dialog');
        dialog.id = 'auth-modal';
        dialog.className = 'auth-dialog';
        dialog.setAttribute('aria-labelledby', 'auth-modal-title');

        dialog.innerHTML = `
            <div class="auth-card">
                <div class="auth-header">
                    <div class="auth-title-group">
                        <h2 id="auth-modal-title">Вход в аккаунт</h2>
                        <p id="auth-modal-subtitle">Синхронизация прогресса и званий с базой данных</p>
                    </div>
                    <button type="button" class="auth-close-btn" id="auth-modal-close" aria-label="Закрыть">✕</button>
                </div>

                <div class="auth-tabs" role="tablist">
                    <button type="button" class="auth-tab-btn active" id="auth-tab-login" role="tab" aria-selected="true">Вход</button>
                    <button type="button" class="auth-tab-btn" id="auth-tab-register" role="tab" aria-selected="false">Регистрация</button>
                </div>

                <form class="auth-form" id="auth-form">
                    <div class="auth-field">
                        <label class="auth-label" for="auth-input-username">Имя пользователя (Логин)</label>
                        <div class="auth-input-wrap">
                            <input class="auth-input" type="text" id="auth-input-username" name="username" required autocomplete="username" placeholder="Буквы, цифры (от 3 симв.)">
                        </div>
                    </div>

                    <div class="auth-field hidden" id="auth-field-display-name" style="display: none;">
                        <label class="auth-label" for="auth-input-display-name">Отображаемое имя (необязательно)</label>
                        <div class="auth-input-wrap">
                            <input class="auth-input" type="text" id="auth-input-display-name" name="displayName" placeholder="Например: Алексей">
                        </div>
                    </div>



                    <div class="auth-field">
                        <label class="auth-label" for="auth-input-password">Пароль</label>
                        <div class="auth-input-wrap">
                            <input class="auth-input" type="password" id="auth-input-password" name="password" required autocomplete="current-password" placeholder="Минимум 6 символов">
                            <button type="button" class="auth-pwd-toggle" id="auth-pwd-toggle" title="Показать/скрыть пароль" aria-label="Показать пароль">👁️</button>
                        </div>
                    </div>

                    <div class="auth-progress-save-hint hidden" id="auth-register-hint" style="display: none;">
                        <span>⚡</span>
                        <span>Ваш текущий гостевой прогресс (XP, серии, рекорды) будет автоматически привязан к новому аккаунту!</span>
                    </div>

                    <div class="auth-error-box hidden" id="auth-error-box" role="alert"></div>

                    <button type="submit" class="auth-submit-btn" id="auth-submit-btn">
                        <span id="auth-submit-text">Войти</span>
                    </button>
                    <div class="auth-guest-link-row">
                        <a href="profile.html" class="auth-guest-link" id="auth-guest-profile-link">Или перейти в гостевой профиль без входа →</a>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(dialog);

        // Bind Modal Events
        const closeBtn = dialog.querySelector('#auth-modal-close');
        closeBtn.addEventListener('click', () => dialog.close());

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.close();
        });

        // Tab Switching
        const tabLogin = dialog.querySelector('#auth-tab-login');
        const tabRegister = dialog.querySelector('#auth-tab-register');
        const fieldDisplayName = dialog.querySelector('#auth-field-display-name');
        const registerHint = dialog.querySelector('#auth-register-hint');
        const titleEl = dialog.querySelector('#auth-modal-title');
        const submitText = dialog.querySelector('#auth-submit-text');
        const errorBox = dialog.querySelector('#auth-error-box');

        function switchMode(mode) {
            errorBox.classList.add('hidden');
            errorBox.textContent = '';
            if (mode === 'register') {
                tabLogin.classList.remove('active');
                tabLogin.setAttribute('aria-selected', 'false');
                tabRegister.classList.add('active');
                tabRegister.setAttribute('aria-selected', 'true');
                fieldDisplayName.classList.remove('hidden');
                fieldDisplayName.style.display = 'flex';
                registerHint.classList.remove('hidden');
                registerHint.style.display = 'flex';
                titleEl.textContent = 'Создание аккаунта';
                submitText.textContent = 'Зарегистрироваться';
            } else {
                tabRegister.classList.remove('active');
                tabRegister.setAttribute('aria-selected', 'false');
                tabLogin.classList.add('active');
                tabLogin.setAttribute('aria-selected', 'true');
                fieldDisplayName.classList.add('hidden');
                fieldDisplayName.style.display = 'none';
                registerHint.classList.add('hidden');
                registerHint.style.display = 'none';
                titleEl.textContent = 'Вход в аккаунт';
                submitText.textContent = 'Войти';
            }
        }
        dialog.switchMode = switchMode;

        tabLogin.addEventListener('click', () => switchMode('login'));
        tabRegister.addEventListener('click', () => switchMode('register'));

        // Password visibility toggle
        const pwdInput = dialog.querySelector('#auth-input-password');
        const pwdToggle = dialog.querySelector('#auth-pwd-toggle');
        pwdToggle.addEventListener('click', () => {
            const isText = pwdInput.type === 'text';
            pwdInput.type = isText ? 'password' : 'text';
            pwdToggle.textContent = isText ? '👁️' : '🔒';
        });

        // Form Submit Handler
        const form = dialog.querySelector('#auth-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const isReg = tabRegister.classList.contains('active');
            const username = dialog.querySelector('#auth-input-username').value.trim();
            const password = pwdInput.value;
            const displayName = isReg ? dialog.querySelector('#auth-input-display-name').value.trim() : '';

            errorBox.classList.add('hidden');
            errorBox.textContent = '';
            const submitBtn = dialog.querySelector('#auth-submit-btn');
            submitBtn.disabled = true;
            submitText.textContent = isReg ? 'Регистрация...' : 'Вход...';

            try {
                if (isReg) {
                    const localData = collectLocalState();
                    const res = await apiRegister(username, password, displayName, localData);
                    currentUser = res.user;
                    const authDisplayName = res.user.displayName || res.user.username;
                    localStorage.setItem('studyUserName', authDisplayName);
                    localStorage.setItem('loggedInUser', authDisplayName);
                    showToast(`Добро пожаловать, ${authDisplayName}!`, 'success');
                } else {
                    const res = await apiLogin(username, password);
                    currentUser = res.user;
                    const authDisplayName = res.user.displayName || res.user.username;
                    localStorage.setItem('studyUserName', authDisplayName);
                    localStorage.setItem('loggedInUser', authDisplayName);
                    if (res.data) {
                        applyServerState(res.data);
                    }
                    localStorage.setItem('studyUserName', authDisplayName);
                    localStorage.setItem('loggedInUser', authDisplayName);
                    showToast(`Вы вошли как ${authDisplayName}`, 'success');
                }

                dialog.close();
                form.reset();
                updateUIForAuthState();
            } catch (err) {
                errorBox.textContent = err.message || 'Произошла непредвиденная ошибка';
                errorBox.classList.remove('hidden');
            } finally {
                submitBtn.disabled = false;
                submitText.textContent = isReg ? 'Зарегистрироваться' : 'Войти';
            }
        });
    }

    // --- 6. HEADER & SETTINGS UI INTEGRATION ---
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function setupHeaderAuthProfileButton() {
        const isProfilePage = window.location.pathname.endsWith('profile.html') || window.location.pathname.endsWith('/profile');

        // Look for existing profile links on page
        const existingProfileLinks = document.querySelectorAll(
            '#header-profile-link, .profile-cta, .nav-profile-link, .profile-link, .nav-profile-btn, .nav-btn[href*="profile.html"]'
        );

        if (existingProfileLinks.length > 0) {
            existingProfileLinks.forEach(link => {
                if (link.dataset.unifiedAuthBound) return;
                link.dataset.unifiedAuthBound = 'true';
                link.classList.add('unified-auth-btn');

                // Wrap in .unified-auth-wrap if not already wrapped
                if (!link.parentElement.classList.contains('unified-auth-wrap')) {
                    const wrap = document.createElement('div');
                    wrap.className = 'unified-auth-wrap';
                    link.parentNode.insertBefore(wrap, link);
                    wrap.appendChild(link);
                }

                link.addEventListener('click', (e) => {
                    if (!currentUser) {
                        e.preventDefault();
                        openModal('login');
                    }
                });
            });
            return;
        }

        if (isProfilePage) {
            // Already on profile page, no separate profile button needed
            return;
        }

        // On other pages with an action container, inject single unified button
        const containers = document.querySelectorAll('.header-actions, .nav-actions');
        containers.forEach(container => {
            if (container.querySelector('.unified-auth-btn, .auth-header-btn')) return;

            const wrap = document.createElement('div');
            wrap.className = 'unified-auth-wrap';

            const link = document.createElement('a');
            link.href = 'profile.html';
            link.className = 'auth-header-btn unified-auth-btn';
            link.dataset.unifiedAuthBound = 'true';
            link.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span class="auth-btn-text">Войти</span>
            `;

            link.addEventListener('click', (e) => {
                if (!currentUser) {
                    e.preventDefault();
                    openModal('login');
                }
            });

            wrap.appendChild(link);
            container.insertBefore(wrap, container.firstChild);
        });
    }

    function updateUIForAuthState() {
        const isTeacherPage = window.location.pathname.endsWith('teacher.html') || window.location.pathname.endsWith('/teacher');
        const isTeacher = (currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin')) || isTeacherPage;
        document.querySelectorAll('.teacher-only-link').forEach(el => {
            el.classList.toggle('hidden', !isTeacher);
        });

        const localXP = parseInt(localStorage.getItem('user_xp') || '0', 10);
        const xpText = `XP +${localXP}`;

        const unifiedButtons = document.querySelectorAll('.unified-auth-btn, #header-profile-link, .profile-cta, .nav-profile-link, .profile-link, .nav-profile-btn, .auth-header-btn');

        unifiedButtons.forEach(btn => {
            const wrap = btn.closest('.unified-auth-wrap') || btn.parentElement;
            let dropdown = wrap ? wrap.querySelector('.auth-dropdown-menu') : null;

            if (currentUser) {
                btn.classList.add('is-logged-in');
                const displayName = currentUser.displayName || currentUser.username;
                const roleBadge = isTeacher ? '🎓 ' : '';
                btn.title = `Личный кабинет: ${displayName} (${isTeacher ? 'Учитель' : 'Ученик'}). Нажмите для перехода`;

                const inner = btn.querySelector('.profile-cta-inner');
                const xpEl = btn.querySelector('.xp-badge, #header-xp-badge, .xp-counter, #nav-xp-badge');

                const caretSvg = `<svg class="auth-dropdown-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;

                if (inner) {
                    inner.innerHTML = `
                        <span class="auth-status-dot"></span>
                        <span class="profile-cta-text">${roleBadge}${escapeHtml(displayName)}</span>
                        ${caretSvg}
                    `;
                } else {
                    btn.innerHTML = `
                        <span class="auth-status-dot"></span>
                        <span class="auth-btn-text">${roleBadge}${escapeHtml(displayName)}</span>
                        ${caretSvg}
                        ${(!isTeacher && xpEl) ? xpEl.outerHTML : (!isTeacher ? `<span class="xp-badge">${xpText}</span>` : '')}
                    `;
                }

                if (xpEl) {
                    if (isTeacher) {
                        xpEl.style.display = 'none';
                    } else {
                        xpEl.style.display = '';
                        xpEl.textContent = xpText;
                    }
                }

                // Attach dropdown menu inside wrap
                if (wrap && !dropdown) {
                    dropdown = document.createElement('div');
                    dropdown.className = 'auth-dropdown-menu';
                    wrap.appendChild(dropdown);
                }

                if (dropdown) {
                    const isSubdir = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/math_moduls/');
                    const prefix = isSubdir ? '../' : '';

                    dropdown.innerHTML = `
                        <div class="auth-dropdown-header">
                            <div class="auth-dropdown-user">${escapeHtml(displayName)}</div>
                            <div class="auth-dropdown-role">@${escapeHtml(currentUser.username)} · ${isTeacher ? 'Учитель' : 'Ученик'}</div>
                        </div>
                        <a href="${prefix}profile.html" class="auth-dropdown-item">
                            <span>👤 Личный кабинет</span>
                        </a>
                        ${isTeacher ? `
                        <a href="${prefix}teacher.html" class="auth-dropdown-item">
                            <span>🎓 Панель учителя</span>
                        </a>
                        ` : ''}
                        <button type="button" class="auth-dropdown-item auth-dropdown-logout-btn">
                            <span>🚪 Выйти из аккаунта</span>
                        </button>
                    `;

                    const logoutBtn = dropdown.querySelector('.auth-dropdown-logout-btn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
                                await apiLogout();
                                currentUser = null;
                                updateUIForAuthState();
                                showToast('Вы вышли из аккаунта', 'success');
                            }
                        });
                    }

                    dropdown.querySelectorAll('.auth-dropdown-item').forEach(item => {
                        item.addEventListener('click', () => {
                            if (wrap) wrap.classList.remove('is-open');
                        });
                    });
                }

                // Bind hover intent & outside click listeners to wrap
                if (wrap && !wrap.dataset.dropdownEventsBound) {
                    wrap.dataset.dropdownEventsBound = 'true';
                    let closeTimer = null;

                    const openDropdown = () => {
                        if (closeTimer) {
                            clearTimeout(closeTimer);
                            closeTimer = null;
                        }
                        if (currentUser) {
                            wrap.classList.add('is-open');
                        }
                    };

                    const closeDropdown = (delay = 240) => {
                        if (closeTimer) clearTimeout(closeTimer);
                        closeTimer = setTimeout(() => {
                            wrap.classList.remove('is-open');
                        }, delay);
                    };

                    wrap.addEventListener('mouseenter', openDropdown);
                    wrap.addEventListener('mouseleave', () => closeDropdown(240));

                    btn.addEventListener('click', (e) => {
                        if (!currentUser) return;
                        if (window.innerWidth > 768) {
                            if (e.target.closest('.auth-dropdown-caret')) {
                                e.preventDefault();
                                e.stopPropagation();
                                wrap.classList.toggle('is-open');
                            }
                        }
                    });

                    document.addEventListener('click', (e) => {
                        if (!wrap.contains(e.target)) {
                            wrap.classList.remove('is-open');
                        }
                    });

                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            wrap.classList.remove('is-open');
                        }
                    });
                }
            } else {
                btn.classList.remove('is-logged-in');
                btn.title = 'Войти в профиль';

                const inner = btn.querySelector('.profile-cta-inner');
                const xpEl = btn.querySelector('.xp-badge, #header-xp-badge, .xp-counter, #nav-xp-badge');

                const userSvg = `<svg class="profile-cta-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

                if (inner) {
                    inner.innerHTML = `
                        ${userSvg}
                        <span class="profile-cta-text">Войти</span>
                    `;
                } else {
                    btn.innerHTML = `
                        ${userSvg}
                        <span class="auth-btn-text">Войти</span>
                        ${xpEl ? xpEl.outerHTML : `<span class="xp-badge">${xpText}</span>`}
                    `;
                }

                if (xpEl) {
                    xpEl.textContent = xpText;
                }

                if (dropdown) {
                    dropdown.remove();
                }
            }
        });

        // Update standalone XP badges (hidden for teachers)
        document.querySelectorAll('#header-xp-badge, #nav-xp-badge').forEach(el => {
            if (isTeacher) {
                el.style.display = 'none';
            } else {
                el.style.display = '';
                el.textContent = xpText;
            }
        });

        // Update Cloud Settings Pane if present in profile.html
        updateCloudSettingsCard();

        window.dispatchEvent(new CustomEvent('study-auth-changed', { detail: currentUser }));
    }

    function updateCloudSettingsCard() {
        const card = document.getElementById('cloud-account-card');
        if (!card) return;

        if (currentUser) {
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div>
                        <div style="font-weight:800; font-size:1.1rem; color:var(--ink);">${currentUser.displayName || currentUser.username}</div>
                        <div style="font-size:0.8rem; color:var(--muted);">Логин: @${currentUser.username} · ID: #${currentUser.id}</div>
                    </div>
                    <span style="display:inline-flex; align-items:center; gap:6px; font-size:0.75rem; padding:4px 10px; border-radius:9999px; background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); font-weight:700;">
                        <span style="width:6px; height:6px; border-radius:50%; background:#10b981;"></span>
                        В сети
                    </span>
                </div>
                <p style="font-size:0.85rem; color:var(--muted); line-height:1.4; margin-bottom:14px;">
                    Ваш прогресс сохраняется в базе данных SQLite. Изменения автоматически синхронизируются при решении задач.
                </p>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button type="button" id="cloud-sync-now-btn" class="settings-btn settings-btn-primary" style="flex:1;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; margin-right:4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Синхронизировать сейчас
                    </button>
                    <button type="button" id="cloud-logout-btn" class="settings-btn settings-btn-secondary" style="flex:1;">
                        Выйти из аккаунта
                    </button>
                </div>
            `;

            const syncBtn = card.querySelector('#cloud-sync-now-btn');
            if (syncBtn) {
                syncBtn.addEventListener('click', async () => {
                    syncBtn.disabled = true;
                    syncBtn.textContent = 'Синхронизация...';
                    try {
                        await syncToCloud();
                        showToast('Все данные успешно сохранены в облачной базе данных!', 'success');
                    } catch (e) {
                        showToast('Ошибка сохранения: ' + e.message, 'error');
                    } finally {
                        syncBtn.disabled = false;
                        syncBtn.innerHTML = `
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; margin-right:4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            Синхронизировать сейчас
                        `;
                    }
                });
            }

            const logoutBtn = card.querySelector('#cloud-logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async () => {
                    if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
                        await apiLogout();
                        currentUser = null;
                        updateUIForAuthState();
                        showToast('Вы вышли из аккаунта', 'success');
                    }
                });
            }
        } else {
            card.innerHTML = `
                <div style="margin-bottom:12px;">
                    <div style="font-weight:800; font-size:1.05rem; color:var(--ink); margin-bottom:4px;">Гостевой режим</div>
                    <div style="font-size:0.85rem; color:var(--muted); line-height:1.4;">
                        Вы не авторизованы. Данные сохраняются только в локальном браузере. Войдите или создайте аккаунт, чтобы сохранять прогресс в базе данных и иметь к нему доступ с любого устройства.
                    </div>
                </div>
                <button type="button" id="cloud-open-auth-btn" class="settings-btn settings-btn-accent" style="width:100%;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; margin-right:4px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Войти или зарегистрироваться
                </button>
            `;
            const openBtn = card.querySelector('#cloud-open-auth-btn');
            if (openBtn) {
                openBtn.addEventListener('click', () => openModal('login'));
            }
        }
    }

    function injectHeaderTrigger() {
        setupHeaderAuthProfileButton();
    }

    // --- 7. PUBLIC API & AUTO-SYNC ---
    async function syncToCloud() {
        if (!currentUser) return null;
        const payload = collectLocalState();
        return await apiSaveUserData(payload);
    }

    function scheduleSync(delay = SYNC_DEBOUNCE_MS) {
        if (!currentUser) return;
        clearTimeout(syncTimer);
        syncTimer = setTimeout(async () => {
            try {
                await syncToCloud();
            } catch (e) {
                console.warn('[AuthSync] Auto-sync skipped or failed:', e);
            }
        }, delay);
    }

    function openAccountModal() {
        let dialog = document.getElementById('account-quick-dialog');
        if (!dialog) {
            dialog = document.createElement('dialog');
            dialog.id = 'account-quick-dialog';
            dialog.className = 'auth-dialog';
            document.body.appendChild(dialog);
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) dialog.close();
            });
        }

        const xp = localStorage.getItem('user_xp') || '0';
        const solved = localStorage.getItem('totalSolvedTasks') || '0';
        const name = currentUser ? (currentUser.displayName || currentUser.username) : 'Пользователь';
        const uname = currentUser ? currentUser.username : '';

        dialog.innerHTML = `
            <div class="auth-card">
                <div class="auth-header">
                    <div class="auth-title-group">
                        <h2>Облачный профиль</h2>
                        <p>Синхронизировано с базой данных SQLite</p>
                    </div>
                    <button type="button" class="auth-close-btn" id="account-quick-close" aria-label="Закрыть">✕</button>
                </div>
                <div style="background:rgba(255,255,255,0.04); border:1px solid var(--line); border-radius:var(--r, 16px); padding:16px;">
                    <div style="font-weight:800; font-size:1.15rem; color:var(--ink);">${name}</div>
                    <div style="font-size:0.8rem; color:var(--muted); margin-bottom:12px;">@${uname}</div>
                    <div style="display:flex; gap:16px; font-size:0.85rem; color:var(--muted);">
                        <div>Опыт: <strong style="color:var(--accent-gold); font-size:0.95rem;">${xp} XP</strong></div>
                        <div>Решено: <strong style="color:var(--accent-cyan); font-size:0.95rem;">${solved}</strong></div>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <a href="/profile.html" class="settings-btn settings-btn-primary" style="text-decoration:none; text-align:center;">
                        Открыть личный кабинет
                    </a>
                    ${(currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin')) ? `
                    <a href="/teacher.html" class="settings-btn" style="text-decoration:none; text-align:center; background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#ffffff !important; box-shadow:0 4px 14px rgba(16,185,129,0.35);">
                        🎓 Панель учителя (Классы)
                    </a>
                    ` : `
                    <button type="button" id="quick-become-teacher-btn" class="settings-btn" style="background:rgba(255,255,255,0.06); color:var(--muted); font-size:0.82rem; border:1px dashed var(--line);">
                        🎓 Войти как учитель
                    </button>
                    `}
                    <button type="button" id="quick-sync-btn" class="settings-btn settings-btn-accent">
                        Синхронизировать сейчас
                    </button>
                    <button type="button" id="quick-logout-btn" class="settings-btn settings-btn-secondary">
                        Выйти из аккаунта
                    </button>
                </div>
            </div>
        `;

        dialog.querySelector('#account-quick-close').addEventListener('click', () => dialog.close());
        dialog.querySelector('#quick-sync-btn').addEventListener('click', async () => {
            const btn = dialog.querySelector('#quick-sync-btn');
            btn.disabled = true;
            btn.textContent = 'Синхронизация...';
            try {
                await syncToCloud();
                showToast('Данные успешно сохранены в базе данных!', 'success');
            } catch (e) {
                showToast('Ошибка сохранения: ' + e.message, 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Синхронизировать сейчас';
            }
        });
        const becomeTeacherBtn = dialog.querySelector('#quick-become-teacher-btn');
        if (becomeTeacherBtn) {
            becomeTeacherBtn.addEventListener('click', async () => {
                const code = prompt('Введите секретный код доступа преподавателя:');
                if (!code) return;
                try {
                    const res = await fetch('/api/teacher/become', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ teacherCode: code })
                    });
                    const d = await res.json();
                    if (!res.ok) throw new Error(d.error || 'Ошибка активации');
                    if (currentUser) currentUser.role = 'teacher';
                    updateUIForAuthState();
                    dialog.close();
                    showToast('Статус учителя успешно активирован!', 'success');
                    window.location.href = '/teacher.html';
                } catch(e) {
                    alert(e.message);
                }
            });
        }

        dialog.querySelector('#quick-logout-btn').addEventListener('click', async () => {
            if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
                await apiLogout();
                currentUser = null;
                updateUIForAuthState();
                dialog.close();
                showToast('Вы вышли из аккаунта', 'success');
            }
        });

        dialog.showModal();
    }

    function openModal(mode = 'login') {
        ensureModalInDOM();
        const dialog = document.getElementById('auth-modal');
        if (!dialog) return;

        if (typeof dialog.switchMode === 'function') {
            dialog.switchMode(mode);
        } else {
            const tabBtn = mode === 'register'
                ? dialog.querySelector('#auth-tab-register')
                : dialog.querySelector('#auth-tab-login');
            if (tabBtn) tabBtn.click();
        }

        dialog.showModal();
    }

    function closeModal() {
        const dialog = document.getElementById('auth-modal');
        if (dialog && dialog.open) dialog.close();
    }

    // --- 8. INITIALIZATION ---
    async function init() {
        if (isInitialized) return;
        isInitialized = true;

        ensureModalInDOM();
        injectHeaderTrigger();

        try {
            const me = await apiCheckMe();
            if (me.loggedIn && me.user) {
                currentUser = me.user;
                // Fetch latest cloud data and merge
                try {
                    const serverData = await apiGetUserData();
                    if (serverData) {
                        applyServerState(serverData);
                    }
                } catch (e) {
                    console.warn('[AuthSync] Could not pull server data:', e);
                }
            }
        } catch (e) {
            console.warn('[AuthSync] Session check error:', e);
        }

        updateUIForAuthState();

        // Listen for storage events or task completions
        window.addEventListener('storage', () => {
            if (currentUser) scheduleSync(4000);
        });
        window.addEventListener('study-task-solved', () => {
            if (currentUser) scheduleSync(1500);
        });
    }

    async function login(username, password) {
        const res = await apiLogin(username, password);
        currentUser = res.user;
        if (res.data) applyServerState(res.data);
        updateUIForAuthState();
        return res;
    }

    async function register(username, password, displayName, localData) {
        const res = await apiRegister(username, password, displayName, localData || collectLocalState());
        currentUser = res.user;
        updateUIForAuthState();
        return res;
    }

    async function logout() {
        const res = await apiLogout();
        currentUser = null;
        updateUIForAuthState();
        return res;
    }

    // Export module
    async function setDisplayName(name) {
        const clean = (name || '').trim();
        if (!clean) return;
        localStorage.setItem('studyUserName', clean);
        localStorage.setItem('loggedInUser', clean);
        if (currentUser) {
            currentUser.displayName = clean;
            try {
                await fetch('/api/user/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ displayName: clean })
                });
            } catch (e) {
                console.warn('[AuthSync] Profile name save error:', e);
            }
            scheduleSync(100);
        }
        updateUIForAuthState();
        window.dispatchEvent(new CustomEvent('study-auth-changed', { detail: currentUser }));
    }

    window.AuthSync = {
        init,
        setDisplayName,
        openModal,
        closeModal,
        openAccountModal,
        syncToCloud,
        scheduleSync,
        getUser: () => currentUser,
        isAuthorized: () => !!currentUser,
        updateCloudSettingsCard,
        logout,
        theme: StudyTheme,
        login,
        register,
        collectLocalState,
        applyServerState
    };

    // Auto-init on DOMContentLoaded or immediately if ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
