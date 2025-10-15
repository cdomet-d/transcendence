import { Router } from './spaRouter/router.class.js';
import { routes } from './spaRouter/routes.js';
import { pong } from './game/pong.js';
import { lobby } from './lobby/lobby.js'
import { addLanguageEvents } from './language/languageEvents.js';
import { initLanguageCSR } from './language/translation.js';

export const router = new Router(routes);

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

if (router._getCurrentURL() === '/game/lobby')
	lobby();

initLanguageCSR();
addLanguageEvents();
