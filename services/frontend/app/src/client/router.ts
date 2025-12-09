import { renderNotFound } from './render-pages.js';
import { match, type Match } from 'path-to-regexp';
import * as page from './render-pages.js';
import type { gameRequest } from './pong/pong.js';

export interface routeInterface {
	path: string;
	callback: (param?: Match<Partial<Record<string, string | string[]>>>, gameRequest?: gameRequest, action?: string, whiteListUsernames?: string[], lobbyWS?: WebSocket) => void;
}

export const routes: routeInterface[] = [
	{ path: '/', callback: page.renderHome },
	{ path: '/404', callback: page.renderNotFound },
	{ path: '/auth', callback: page.renderAuth },
	{ path: '/leaderboard', callback: page.renderLeaderboard },
	{ path: '/me', callback: page.renderSelf },
	{ path: '/user/:login', callback: page.renderProfile },
	{ path: '/user/settings', callback: page.renderSettings },
	{ path: '/lobby-menu', callback: page.renderLobbyMenu },
	{ path: '/quick-local-lobby', callback: page.renderQuickLocalLobby },
	{ path: '/quick-remote-lobby', callback: page.renderQuickRemoteLobby },
	{ path: '/tournament-lobby', callback: page.renderTournamentLobby },
	{ path: '/game', callback: page.renderGame },
	{ path: '/privacy', callback: page.renderPrivacy },
];

export async function DOMReady(): Promise<void> {
	await new Promise((resolve) => requestAnimationFrame(resolve));
	await new Promise((resolve) => requestAnimationFrame(resolve));
}

export class Router {
	/*                            PROPERTIES                                  */
	_routes: Array<routeInterface>;
	#stepBefore: string;

	/*                           CONSTRUCTORS                                 */
	constructor(routes: routeInterface[]) {
		this._routes = routes;
		this.#stepBefore = '';
	}

	/*                             METHODS                                    */
	#getRouteFromPath(path: string): routeInterface | undefined {
		return this._routes.find((route) => route.path === path);
	}

	get stepBefore(): string {
		return this.#stepBefore;
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

	updateURL(newURL: string) {
		window.history.pushState({}, '', newURL);
	}

	/** Parses the defined route array to check if the current URL is defined as a route.
	 * Calls `renderNotFount()` if the route was not found, and the route's callback otherwise.
	 */
	loadRoute(path: string, updateHistory: boolean, gameRequest?: gameRequest, action?: string, whiteListUsernames?: string[], lobbyWS?: WebSocket) {
		this.#stepBefore = this.currentPath;
		this.sanitisePath(path);

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
        if (updateHistory && path !== window.location.pathname) this.updateURL(path);
        if (!matchedRoute) {
            renderNotFound();
            return;
        }
        matchedRoute.callback(res ? res : undefined, gameRequest, action, whiteListUsernames, lobbyWS);
    }
}
