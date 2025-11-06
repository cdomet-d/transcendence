import { renderNotFound } from '../../pages/render-pages.js';
import { pong } from '../game/pong.js';

interface routeInterface {
    path: string;
    callback: () => void;
}

export class Router {
    /*                            PROPERTIES                                  */
    _routes: Array<routeInterface>;

    /*                           CONSTRUCTORS                                 */
    constructor(routes: routeInterface[]) {
        this._routes = routes;
    }

    /*                             METHODS                                    */
    #getRouteFromPath(path: string): routeInterface | undefined {
        return this._routes.find((route) => route.path === path);
    }

    /** Getter for current path
     *	@returns `window.location.pathname`
     */
    get currentPath() {
        return window.location.pathname;
    }

    // resolveUrl() {
    //     const route: routeInterface | undefined = this.#getRouteFromPath(this.currentPath);
    //     if (!route) renderNotFound;
    //     else route.callback;
    // }

    sanitisePath(path: string) {
        if (path == '/') return path;
        return path.replace(/\/+$/, '');
    }

    /**
     * Parses the defined route array to check if the current URL is defined as a route.
     * Calls `renderNotFount()` if the route was not found, and the route's callback otherwise.
     */
    loadRoute(path: string) {
        const matchedRoute = this.#getRouteFromPath(path);
        if (!matchedRoute) {
            renderNotFound();
            return;
        }

        matchedRoute.callback();

        if (matchedRoute.path === '/game/match') pong();
        //TODO: eventually if other features need their script add an element script to routeInterface
    }
}
