import { render404 } from './404.ts';
import { renderHeader, clearHeader } from './header.ts';

export class Router {
    routes: Array<{ path: string, callback: Function }>;

    constructor(routes) {
        this.routes = routes;
        this._loadInitialRoute();
    }

    _getCurrentURL() {
        return window.location.pathname;
    }

    _matchUrlToRoute(path) {
        return this.routes.find(route => route.path === path);
    }

    _loadInitialRoute() {
        this._loadRoute(this._getCurrentURL());
    }

    _loadRoute(path) {
        const main = document.getElementById('app');
        const headerDiv = document.getElementById('header');

        console.log('Loading route:', path);

        if (!main || !headerDiv) return;

        const matchedRoute = this._matchUrlToRoute(path);
        if (!matchedRoute) {
            // throw new Error('Route not found');
            render404(main);
            return;
        }

        console.log('Matched route:', matchedRoute.path);

        if (matchedRoute.path === '/game') {
            renderHeader();
            headerDiv.style.display = 'block';
        }
        else {
            clearHeader();
            headerDiv.style.display = 'none';
        }
        matchedRoute.callback(main);
    }

    navigateTo(path) {
        window.history.pushState({}, '', path);
        this._loadRoute(path);
    }
}
