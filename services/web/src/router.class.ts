import { render404 } from './404.js';
import { renderHeader, clearHeader } from './header.js';

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
        const main = document.getElementById('app');
        const headerDiv = document.getElementById('header');

        console.log('Loading route:', path);

        if (!main || !headerDiv) return;

        const matchedRoute = this._matchUrlToRoute(path);
        if (!matchedRoute) {
            // throw new Error('Route not found');
            render404(main);
            return;
        }

        console.log('Matched route:', matchedRoute.path);

        if (matchedRoute.path === '/game') {
            renderHeader();
            headerDiv.style.display = 'block';
        }
        else {
            clearHeader();
            headerDiv.style.display = 'none';
        }
        matchedRoute.callback(main);
    }
    
    navigateTo(path: string): void {
        window.history.pushState({}, '', path);
        this._loadRoute(path);
    }
}