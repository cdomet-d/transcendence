import { Router } from './router.class.js';
import { routes } from './routes.js';
import { pong } from '../scripts/game/pong.js';
import { addLanguageEvents } from '../scripts/language/languageEvents.js';
import { initLanguage } from '../scripts/language/translation.js';

const router = new Router(routes);

function sanitisePath(path: string) {
    if (path == "/")
        return path;
    return path.replace(/\/+$/, '');
}

document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest('[data-link]');
    if (link) {
        event.preventDefault();
        const path = link.getAttribute('href');
		if (path !== null) {
	        window.history.pushState({}, '', path);
	        const cleanPath = sanitisePath(path);
			router._loadRoute(cleanPath);
		}
    }
});

window.addEventListener('popstate', () => {
    const cleanPath = sanitisePath(window.location.pathname);
    router._loadRoute(cleanPath);
});

if (window.location.pathname === '/game/match') {
    pong();
    import("../scripts/game/wsreply.js").then((game) => {
        game.wsRequest();
    })
}

initLanguage();

addLanguageEvents(router._getCallback());
