import { renderNotFound } from '../../pages/html.pages.js';
import { clearHeader, renderHeader } from '../../pages/header.js'
import { lobby } from '../lobby/lobby.js'
import type { routeInterface } from '../spaRouter/routes.js'

export class Router {
	/*                            PROPERTIES                                  */
	_routes: Array<routeInterface>;

	/*                           CONSTRUCTORS                                 */
	constructor(routes: routeInterface[]) {
		this._routes = routes;
	}

	/*                             METHODS                                    */
	_getCurrentURL() {
		return window.location.pathname;
	}

    #matchUrlToRoute(path: string): routeInterface | undefined {
        return this._routes.find(route => route.path === path);
    }

    getCallback() : routeInterface["callback"] {
        const route: routeInterface | undefined = this.#matchUrlToRoute(this._getCurrentURL());
        if (!route)
            return renderNotFound;
        return route.callback;
    }

    loadRoute(path: string) {
        const page = document.getElementById('page');
        const header = document.getElementById('header');

		if (!page || !header) return; //TODO: handle error

        const matchedRoute = this.#matchUrlToRoute(path);
        if (!matchedRoute) {
            // throw new Error('Route not found');
            page.innerHTML = renderNotFound();
            return;
        }

		// TODO: try to load header once and change display instead of function calling everytime
		if (matchedRoute.path === '/') {
			// header.style.display = "hidden";
			clearHeader();
		} else {
			// header.style.display = "block";
			document.getElementById('header')!.innerHTML = renderHeader();
		}

		page.innerHTML = matchedRoute.callback();

		if (matchedRoute.path === '/game/lobby')
			lobby();
	}
}
