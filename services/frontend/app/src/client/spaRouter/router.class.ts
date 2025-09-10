import { render404 } from '../../pages/html.pages.js';
import { clearHeader, renderHeader } from '../../pages/header.js'

interface routeInterface {
    path: string;
    callback: (main: any) => void;
}

export class Router {
    _routes: Array<{ path: string, callback: Function }>;

    constructor(routes: routeInterface[]) {
        this._routes = routes;
        // this._loadInitialRoute();
    }

    _getCurrentURL() {
        return window.location.pathname;
    }

    _matchUrlToRoute(path: string) {
        return this._routes.find(route => route.path === path);
    }

    _loadInitialRoute() {
        this._loadRoute(this._getCurrentURL());
    }

    _loadRoute(path: string) {
        const app = document.getElementById('app');
        const header = document.getElementById('header');

        if (!app || !header) return;

        const matchedRoute = this._matchUrlToRoute(path);
        if (!matchedRoute) {
            // throw new Error('Route not found');
            app.innerHTML = render404();
            return;
        }

        // TODO try to load header once and change display instead of function calling everytime
        if (matchedRoute.path === '/') {
            // header.style.display = "hidden";
            clearHeader();
        } else {
            // header.style.display = "block";
            document.getElementById('header')!.innerHTML = renderHeader();
        }

		// init();
        app.innerHTML = matchedRoute.callback();
    }
}
