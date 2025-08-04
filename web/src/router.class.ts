import { render404 } from './404.ts';
import { renderHeader, clearHeader } from './header.ts';

export class Router {
    _routes: Array<{ path: string, callback: Function }>;

    constructor(routes) {
        this._routes = routes;
        this._loadInitialRoute();
    }

    _getCurrentURL() {
        return window.location.pathname;
    }

    _matchUrlToRoute(path) {
        return this._routes.find(route => route.path === path);
    }

    _loadInitialRoute() {
        this._loadRoute(this._getCurrentURL());
    }

    _loadRoute(path) {
        const main = document.getElementById('app');
        const header = document.getElementById('header');

        if (!main || !header) return;

        const matchedRoute = this._matchUrlToRoute(path);
        if (!matchedRoute) {
            // throw new Error('Route not found');
            render404(main);
            return;
        }

        if (matchedRoute.path === '/game') {
            renderHeader();
        }
        else {
            clearHeader();
        }
        matchedRoute.callback(main);
    }

    navigateTo(path) {
        window.history.pushState({}, '', path);
        this._loadRoute(path);
    }
}
