import { render404 } from './404.ts';
import { renderHeader, clearHeader } from './header.ts';

interface routeInterface {
    path: string;
    callback: (main: any) => void;
}

export class Router {
    _routes: Array<{ path: string, callback: Function }>;

    constructor(routes: routeInterface[]) {
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

        // TODO try to load header once and change display instead of function calling everytime
        if (matchedRoute.path === '/') {
            // header.style.display = "hidden";
            clearHeader();
        } else {
            // header.style.display = "block";
            renderHeader();
        }
        matchedRoute.callback(main);
    }
}
