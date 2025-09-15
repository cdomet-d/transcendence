import { render404 } from '../../pages/html.pages.js';
import { clearHeader, renderHeader } from '../../pages/header.js'
import { pong } from '../game/pong.js';

interface routeInterface {
    path: string;
    callback: () => string;
}

export class Router {
    _routes: Array< routeInterface >;

    constructor(routes: routeInterface[]) {
        this._routes = routes;
    }

    _getCurrentURL() {
        return window.location.pathname;
    }

    _matchUrlToRoute(path: string): routeInterface | undefined {
        return this._routes.find(route => route.path === path);
    }

    _getCallback() : routeInterface["callback"] {
        const route: routeInterface | undefined = this._matchUrlToRoute(this._getCurrentURL());
        if (!route)
            return render404;
        return route.callback;
    }

    _loadRoute(path: string) {
        const page = document.getElementById('page');
        const header = document.getElementById('header');

        if (!page || !header) return;

        const matchedRoute = this._matchUrlToRoute(path);
        if (!matchedRoute) {
            // throw new Error('Route not found');
            page.innerHTML = render404();
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

        page.innerHTML = matchedRoute.callback();
        
        if (matchedRoute.path === '/game/match') {
            pong();
            import("../game/wsreply.js").then((game) => {
                game.wsRequest();
            })
        }
    }
}
