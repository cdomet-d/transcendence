import { Router } from './spaRouter/router.class.js';
import { routes } from './spaRouter/routes.js';
import { pong } from './game/pong.js';
import { addLanguageEvents } from './language/languageEvents.js';
import { initLanguageCSR } from './language/translation.js';

export const router = new Router(routes);

function sanitisePath(path: string) {
    if (path == "/")
        return path;
    return path.replace(/\/+$/, '');
}

document.addEventListener('click', (event) => {
	console.log('Do we even get there ?')
    const link = (event.target as HTMLElement).closest('[data-link]');
    if (link) {
        event.preventDefault();
        const path = link.getAttribute('href');
		console.log('In event listener')
		if (path !== null) {
	        window.history.pushState({}, '', path);
	        const cleanPath = sanitisePath(path);
			router.loadRoute(cleanPath);
		}
    }
});

window.addEventListener('popstate', () => {
	and
    const cleanPath = sanitisePath(window.location.pathname);
    router.loadRoute(cleanPath);
});

if (router._getCurrentURL() === '/game/match')
    pong(); //TODO: find a way to render it server side

initLanguageCSR();
addLanguageEvents();
