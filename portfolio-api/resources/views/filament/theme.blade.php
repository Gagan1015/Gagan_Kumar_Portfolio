<style>
    .fi-panel-admin {
        --gk-ink: #08090d;
        --gk-panel: #17181d;
        --gk-panel-2: #202126;
        --gk-line: rgba(255, 255, 255, 0.12);
        --gk-soft: #b6bcc9;
        --gk-paper: #f4efe7;
        --gk-sky: #21a8e8;
        --gk-green: #00d06f;
        --gk-coral: #ff6b5f;
        --gk-gold: #f3b23c;
    }

    .gk-brand-logo {
        align-items: center;
        color: currentColor;
        display: inline-flex;
        gap: 0.65rem;
        height: 100%;
        min-width: 0;
    }

    .gk-brand-mark {
        aspect-ratio: 1;
        background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.18), transparent 40%),
            conic-gradient(from 140deg, var(--gk-coral), var(--gk-gold), var(--gk-green), var(--gk-sky), var(--gk-coral));
        border-radius: 0.6rem;
        box-shadow: 0 6px 18px rgba(33, 168, 232, 0.18);
        display: grid;
        flex: 0 0 auto;
        height: 1.75rem;
        overflow: hidden;
        place-items: center;
        position: relative;
    }

    .gk-brand-mark::after {
        background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent),
            var(--gk-ink);
        border-radius: 0.46rem;
        content: "";
        inset: 1.5px;
        position: absolute;
    }

    .gk-brand-mark__initials {
        color: #fff;
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        line-height: 1;
        position: relative;
        z-index: 1;
    }

    .gk-brand-copy {
        display: grid;
        gap: 0.15rem;
        line-height: 1;
        min-width: 0;
    }

    .gk-brand-copy__name {
        font-size: 0.88rem;
        font-weight: 700;
        letter-spacing: -0.005em;
        line-height: 1.05;
        white-space: nowrap;
    }

    .gk-brand-copy__meta {
        color: var(--gk-sky);
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        line-height: 1;
        text-transform: uppercase;
    }

    .gk-auth-login.fi-body {
        background:
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(135deg, #050608 0%, #0d1117 44%, #050608 100%);
        background-size: 42px 42px, 42px 42px, auto;
        margin: 0;
        overflow: hidden;
    }

    html:has(.gk-auth-login) {
        overflow: hidden;
    }

    .gk-auth-login .fi-simple-layout {
        display: block;
        min-height: 100svh;
        width: 100vw;
    }

    .gk-auth-login .fi-simple-page {
        height: 100svh;
        margin: 0;
        overflow: hidden;
        width: 100vw;
    }

    .gk-auth-login .fi-simple-main-ctn {
        display: block;
        height: 100svh;
        margin: 0;
        min-height: 0;
        padding: 0;
        width: 100vw;
    }

    .gk-auth-login .fi-simple-main {
        height: 100svh;
        margin: 0;
        max-width: none !important;
        padding: 0;
        width: 100vw !important;
    }

    .gk-auth-login .fi-simple-page-content {
        background:
            linear-gradient(90deg, var(--gk-paper) 0 48%, transparent 48%),
            linear-gradient(135deg, var(--gk-panel), #111216);
        border: 0;
        border-radius: 0;
        box-shadow: none;
        display: grid;
        grid-template-columns: minmax(0, 48vw) minmax(0, 52vw);
        grid-template-rows: minmax(0, 1fr) auto;
        height: 100svh;
        margin: 0;
        min-height: 0;
        overflow: hidden;
        position: relative;
        width: 100vw;
    }

    .gk-auth-login .fi-simple-page-content::before {
        background: linear-gradient(90deg, var(--gk-coral), var(--gk-gold), var(--gk-green), var(--gk-sky));
        content: "";
        height: 0.32rem;
        inset: 0 auto 0 48vw;
        position: absolute;
        width: 0.32rem;
        z-index: 2;
    }

    .gk-auth-login .fi-simple-header {
        align-items: flex-start;
        color: var(--gk-ink);
        display: flex;
        flex-direction: column;
        gap: clamp(1.25rem, 2.4vw, 2rem);
        grid-column: 1;
        grid-row: 1;
        justify-content: center;
        min-height: 0;
        padding: clamp(2rem, 4vw, 4rem) clamp(2.5rem, 5vw, 5.25rem) clamp(1.25rem, 2.5vw, 2rem);
        text-align: left;
    }

    .gk-auth-login .fi-simple-header .fi-logo {
        color: var(--gk-ink);
        height: 2.6rem !important;
        margin: 0 0 clamp(0.5rem, 1vw, 1rem);
    }

    .gk-auth-login .fi-simple-header .gk-brand-logo {
        gap: 0.85rem;
    }

    .gk-auth-login .fi-simple-header .gk-brand-mark {
        border-radius: 0.85rem;
        box-shadow: 0 12px 30px rgba(33, 168, 232, 0.22);
        height: 100%;
    }

    .gk-auth-login .fi-simple-header .gk-brand-mark::after {
        border-radius: 0.7rem;
        inset: 2px;
    }

    .gk-auth-login .fi-simple-header .gk-brand-mark__initials {
        font-size: 0.92rem;
        letter-spacing: 0.06em;
    }

    .gk-auth-login .fi-simple-header .gk-brand-copy {
        gap: 0.28rem;
    }

    .gk-auth-login .fi-simple-header .gk-brand-copy__name {
        font-size: 1.08rem;
        font-weight: 760;
    }

    .gk-auth-login .fi-simple-header .gk-brand-copy__meta {
        color: #b95436;
        font-size: 0.66rem;
        letter-spacing: 0.22em;
    }

    .gk-auth-login .fi-simple-header-heading {
        color: var(--gk-ink);
        font-size: clamp(2.75rem, 5.4vw, 5.5rem);
        font-weight: 820;
        letter-spacing: -0.02em;
        line-height: 0.98;
        margin: 0;
        max-width: 13ch;
        text-align: left;
    }

    .gk-auth-login .fi-simple-header-subheading {
        color: rgba(8, 9, 13, 0.62);
        font-size: 1.02rem;
        line-height: 1.6;
        margin: 0;
        max-width: 28rem;
        text-align: left;
    }

    .gk-login-panel {
        align-self: end;
        border-top: 1px solid rgba(8, 9, 13, 0.08);
        color: var(--gk-ink);
        display: grid;
        gap: 1rem;
        grid-column: 1;
        grid-row: 2;
        padding: clamp(1.5rem, 2.6vw, 2.25rem) clamp(2.5rem, 5vw, 5.25rem) clamp(2rem, 4vw, 3.5rem);
    }

    .gk-login-panel__kicker {
        color: #9d4d33;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.22em;
        margin: 0;
        text-transform: uppercase;
    }

    .gk-login-panel__title {
        color: var(--gk-ink);
        font-size: clamp(1.05rem, 1.45vw, 1.35rem);
        font-weight: 700;
        letter-spacing: -0.005em;
        line-height: 1.3;
        margin: 0;
        max-width: 22rem;
    }

    .gk-login-panel__rule {
        background: linear-gradient(90deg, var(--gk-coral), var(--gk-gold), var(--gk-green), var(--gk-sky));
        border-radius: 999px;
        height: 0.18rem;
        margin: 0.25rem 0;
        max-width: 7rem;
    }

    .gk-login-panel__grid {
        display: grid;
        gap: 0.5rem 0.6rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin: 0;
        max-width: 22rem;
    }

    .gk-login-panel__grid span {
        background: rgba(8, 9, 13, 0.02);
        border: 1px solid rgba(8, 9, 13, 0.12);
        border-radius: 999px;
        color: rgba(8, 9, 13, 0.72);
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        padding: 0.5rem 0.95rem;
        text-align: center;
    }

    .gk-auth-login .fi-simple-page-content > .fi-sc {
        display: contents;
    }

    .gk-auth-login .fi-simple-page-content > .fi-sc > .fi-grid-col:not(.fi-hidden) {
        background:
            linear-gradient(180deg, rgba(33, 168, 232, 0.07), transparent 35%),
            var(--gk-panel);
        border-left: 1px solid var(--gk-line);
        grid-column: 2;
        grid-row: 1 / 3;
        padding: clamp(2rem, 5vw, 5rem);
    }

    .gk-auth-login .fi-sc-form {
        align-content: center;
        display: grid;
        height: 100%;
        margin-inline: auto;
        max-width: 28rem;
        width: min(100%, 28rem);
    }

    .gk-auth-login .fi-input-wrp,
    .gk-auth-login .fi-checkbox-input {
        transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
    }

    .gk-auth-login .fi-input-wrp:focus-within {
        box-shadow: 0 0 0 4px rgba(33, 168, 232, 0.16);
        transform: translateY(-1px);
    }

    .gk-auth-login .fi-btn {
        box-shadow: 0 16px 34px rgba(33, 168, 232, 0.22);
        transition: box-shadow 180ms ease, transform 180ms ease;
    }

    .gk-auth-login .fi-btn:hover {
        box-shadow: 0 20px 45px rgba(33, 168, 232, 0.28);
        transform: translateY(-1px);
    }

    @media (max-width: 900px) {
        .gk-auth-login.fi-body,
        html:has(.gk-auth-login) {
            overflow: auto;
        }

        .gk-auth-login .fi-simple-main,
        .gk-auth-login .fi-simple-main-ctn,
        .gk-auth-login .fi-simple-page,
        .gk-auth-login .fi-simple-page-content {
            height: auto;
            min-height: 100svh;
        }

        .gk-auth-login .fi-simple-page-content {
            background: linear-gradient(180deg, var(--gk-paper) 0 46%, var(--gk-panel) 46%);
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            overflow: visible;
        }

        .gk-auth-login .fi-simple-page-content::before {
            height: 0.28rem;
            inset: 0 0 auto;
            width: auto;
        }

        .gk-auth-login .fi-simple-header,
        .gk-login-panel,
        .gk-auth-login .fi-simple-page-content > .fi-sc > .fi-grid-col:not(.fi-hidden) {
            grid-column: 1;
        }

        .gk-auth-login .fi-simple-header {
            grid-row: 1;
            justify-content: start;
            padding-bottom: 1rem;
        }

        .gk-login-panel {
            grid-row: 2;
        }

        .gk-auth-login .fi-simple-page-content > .fi-sc > .fi-grid-col:not(.fi-hidden) {
            border-left: 0;
            border-top: 1px solid var(--gk-line);
            grid-row: auto;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .gk-auth-login .fi-btn,
        .gk-auth-login .fi-input-wrp,
        .gk-auth-login .fi-checkbox-input {
            transition: none;
        }
    }
</style>
