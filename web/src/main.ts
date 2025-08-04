import { Router } from './router.class.ts';
import { routes } from './routes.ts';

const main = document.getElementById('app');

const router = new Router(routes);

function normalizePath(path) {
    if (path == "/")
        return path;
    return path.replace(/\/+$/, '');
}

document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('[data-link]');
    if (link) {
        e.preventDefault();
        const path = link.getAttribute('href');
        window.history.pushState({}, '', path);
        const cleanPath = normalizePath(path);
        router.navigateTo(cleanPath);
    }
});

window.addEventListener('popstate', () => {
    const cleanPath = normalizePath(window.location.pathname);
    router._loadRoute(cleanPath);
});
