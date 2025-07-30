interface Route {
    path: string;
    callback: (main: HTMLElement | null) => void;
}

export class Router {
    routes: Route[];
    
    constructor(routes: Route[]) {
        this.routes = routes;
        this._loadInitialRoute();
    }
    
    _getCurrentURL(): string {
        return window.location.pathname;
    }
    
    _matchUrlToRoute(path: string): Route | undefined {
        return this.routes.find(route => route.path === path);
    }
    
    _loadInitialRoute(): void {
        this._loadRoute(this._getCurrentURL());
    }
    
    _loadRoute(path: string): void {
        const matchedRoute = this._matchUrlToRoute(path);
        if (!matchedRoute) {
            throw new Error('Route not found');
        }
        const main = document.getElementById('app');
        matchedRoute.callback(main);
    }
    
    navigateTo(path: string): void {
        window.history.pushState({}, '', path);
        this._loadRoute(path);
    }
}