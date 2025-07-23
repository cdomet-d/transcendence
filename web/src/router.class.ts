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
        const matchedRoute = this._matchUrlToRoute(path);
        if (!matchedRoute) {
            throw new Error('Route not found');
        }
        const main = document.getElementById('app');
        matchedRoute.callback(main);
    }

    navigateTo(path) {
        window.history.pushState({}, '', path);
        this._loadRoute(path);
    }
}
