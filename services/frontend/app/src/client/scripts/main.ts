import { computeViewportSize, loadHistoryLocation } from './event-listeners.js';
import { Layout } from '../web-elements/layouts/layout.js';
import { Router } from './spaRouter/router.class.js';
import { routes } from './spaRouter/routes.js';

// import { pong } from './game/pong.js';
// import { addLanguageEvents } from './language/languageEvents.js';
// import { initLanguageCSR } from './language/translation.js';

export const router = new Router(routes);

declare global {
  interface HTMLElement {
    layoutInstance: Layout | null;
  }
}

if (window) {
	computeViewportSize();
	/** Handles window resize so things stay cute */
    window.addEventListener('resize', computeViewportSize);
	/** Enables back/forward navigation arrows */
    window.addEventListener('popstate', loadHistoryLocation);
}

document.body.layoutInstance = null;
router.loadRoute(router.currentPath);

// if (router._getCurrentURL() === '/game/match')
//     pong(); //TODO: find a way to render it server side

// initLanguageCSR();
// addLanguageEvents();
