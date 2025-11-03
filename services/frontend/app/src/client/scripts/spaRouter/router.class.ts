import { renderNotFound } from '../../pages/render-pages.js';
import { pong } from '../game/pong.js';

interface routeInterface {
    path: string;
    callback: () => void;
}

export class Router {
    /*                            PROPERTIES                                  */
    _routes: Array< routeInterface >;

    /*                           CONSTRUCTORS                                 */
    constructor(routes: routeInterface[]) {
        this._routes = routes;
    }

    /*                             METHODS                                    */
    _getCurrentURL() {
        return window.location.pathname;
    }

    _matchUrlToRoute(path: string): routeInterface | undefined {
        return this._routes.find(route => route.path === path);
    }

    _getCallback() {
        const route: routeInterface | undefined = this._matchUrlToRoute(this._getCurrentURL());
        if (!route)
            renderNotFound;
    	else 
			route.callback;
    }

    _loadRoute(path: string) {
        const matchedRoute = this._matchUrlToRoute(path);
        if (!matchedRoute) {
				renderNotFound;
            return;
        }
        matchedRoute.callback();
        
        if (matchedRoute.path === '/game/match')
            pong();
        //TODO: eventually if other features need their script add an element script to routeInterface
    }
}
