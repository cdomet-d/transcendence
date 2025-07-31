import { Router } from './router.class.ts';
import { routes } from './routes.ts';

const main = document.getElementById('app');

const router = new Router(routes);

function handleNavigation(path) {
    // if (path === '/game')

    const matched = routes.find(route => route.path === path);
    if (matched) {
        matched.callback(main);
    }
    else {
        main.innerHTML = 'Not found!';
    }
}

document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('[data-link]');
    if (link) {
        e.preventDefault();
        const path = link.getAttribute('href');
        window.history.pushState({}, '', path);
        handleNavigation(path);
    }
});

window.addEventListener('popstate', () => handleNavigation(window.location.pathname));
window.addEventListener('DOMContentLoaded', () => handleNavigation(window.location.pathname));
