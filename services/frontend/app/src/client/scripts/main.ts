import { computeViewportSize, loadHistoryLocation } from './event-listeners.js';
import { Layout } from '../web-elements/layouts/layout.js';
import { PageHeader } from '../web-elements/navigation/header.js';
import { Router } from './spaRouter/router.class.js';
import { routes } from './spaRouter/routes.js';

// import { pong } from './game/pong.js';
// import { addLanguageEvents } from './language/languageEvents.js';
// import { initLanguageCSR } from './language/translation.js';

export const router = new Router(routes);

declare global {
    interface HTMLElement {
        layoutInstance: Layout | undefined;
        header: PageHeader | undefined;
    }
}

if (window) {
    computeViewportSize();
    /** Handles window resize so things stay cute */
    window.addEventListener('resize', computeViewportSize);
    /** Enables back/forward navigation arrows */
    window.addEventListener('popstate', loadHistoryLocation);
}

document.body.layoutInstance = document.createElement('div', { is: 'custom-layout' }) as Layout;
document.body.header = document.createElement('header', { is: 'page-header' }) as PageHeader;
if (!document.body.layoutInstance || !document.body.header) {
    throw new Error('Error initializing HTML Layouts - page cannot be charged.');
}
document.body.append(document.body.header, document.body.layoutInstance);
router.loadRoute(router.currentPath);

// if (router._getCurrentURL() === '/game/match')
//     pong(); //TODO: find a way to render it server side

// initLanguageCSR();
// addLanguageEvents();
