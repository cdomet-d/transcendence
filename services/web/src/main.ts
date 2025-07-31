import { Router } from './router.class.js';
import { routes } from './routes.js';
import { renderHeader } from './header.js'

const main = document.getElementById('app');
const router = new Router(routes);

function handleNavigation(path: string): void {
    if (!main) return;
    
    const header = document.getElementById('header');
    
    if (path === '/game') {
        renderHeader();
    } else {
        // Vérification que header n'est pas null
        if (header) {
            header.innerHTML = '';
        }
    }

    const matched = routes.find(route => route.path === path);
    if (matched) {
        matched.callback(main);
    } else {
        main.innerHTML = 'Not found!';
    }
}


document.addEventListener('click', (e: Event) => {
    const link = (e.target as HTMLElement).closest('[data-link]');
    if (link) {
        e.preventDefault();
        const path = link.getAttribute('href');
        if (path) {
            window.history.pushState({}, '', path);
            handleNavigation(path);
        }
    }
});

window.addEventListener('popstate', () => handleNavigation(window.location.pathname));
window.addEventListener('DOMContentLoaded', () => handleNavigation(window.location.pathname));