import { renderNotFound } from '../pages/render-pages.js';
import { pong } from './game/pong.js';
import { match, type Match } from 'path-to-regexp';
import * as page from '../pages/render-pages.js';

export interface routeInterface {
    path: string;
    callback: (param?: Match<Partial<Record<string, string | string[]>>>) => void;
}

export const routes: routeInterface[] = [
    { path: '/', callback: page.renderHome },
    { path: '/404', callback: page.renderNotFound },
    { path: '/leaderboard', callback: page.renderLeaderboard },
    //TODO: handle dynamic URL to serve the user's profile, not a generic profile page
    { path: '/user/:login', callback: page.renderProfile },
    //   { path: '/central', callback: page.renderCentral },
    //   { path: '/game/tournament', callback: page.renderTournament },
    //   { path: '/game/match', callback: page.renderGame},
];

export class Router {
    /*                            PROPERTIES                                  */
    _routes: Array<routeInterface>;

    /*                           CONSTRUCTORS                                 */
    constructor(routes: routeInterface[]) {
        this._routes = routes;
    }

    /*                             METHODS                                    */
    #getRouteFromPath(path: string): routeInterface | undefined {
        console.log(path);
        return this._routes.find((route) => route.path === path);
    }

    /** Getter for current path
     *	@returns `window.location.pathname`
     */
    get currentPath() {
        return window.location.pathname;
    }

    sanitisePath(path: string) {
        if (path == '/') return path;
        return path.replace(/\/+$/, '');
    }

    /**
     * Parses the defined route array to check if the current URL is defined as a route.
     * Calls `renderNotFount()` if the route was not found, and the route's callback otherwise.
     */
    loadRoute(path: string) {
        let matchedRoute = this.#getRouteFromPath(path);
        let res: Match<Partial<Record<string, string | string[]>>> = false;

        if (!matchedRoute) {
            for (const route of this._routes) {
                const dynRoute = match(route.path);
                res = dynRoute(path);
                if (res) {
                    matchedRoute = route;
                    break;
                }
            }
        }

        if (!matchedRoute) {
            renderNotFound();
            return;
        }

        matchedRoute.callback(res ? res : undefined);

        if (matchedRoute.path === '/game/match') pong();
        //TODO: eventually if other features need their script add an element script to routeInterface
    }
}

// Argument of type 'Partial<Record<string, string | string[]>> | undefined'
// is not assignable to parameter of type
// 					'Match<Partial<Record<string, string | string[]>>> | undefined'.
