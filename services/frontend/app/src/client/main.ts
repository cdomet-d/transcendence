import { loadHistoryLocation } from './event-listeners.js';
import { Layout } from './web-elements/layouts/layout.js';
import { PageHeader } from './web-elements/navigation/header.js';
import { Router, routes } from './router.js';
import { errorMessageFromException, redirectOnError } from './error.js';

export const router = new Router(routes);

declare global {
    interface HTMLElement {
        layoutInstance: Layout | undefined;
        header: PageHeader | undefined;
    }
}

export interface userStatusInfo {
    auth: boolean;
    username?: string;
    userID?: string;
}

if (window) {
    window.addEventListener('popstate', loadHistoryLocation);
}

export async function userStatus(): Promise<userStatusInfo> {
    try {
        const isLogged: Response = await fetch('https://localhost:8443/api/auth/status');
        const data = await isLogged.json();
        if (isLogged.ok) return { auth: true, username: data.username, userID: data.userID };
        else return { auth: false };
    } catch (error) {
        redirectOnError('/', errorMessageFromException(error));
        return { auth: false };
    }
}

document.body.layoutInstance = document.createElement('main', { is: 'custom-layout' }) as Layout;
document.body.header = document.createElement('header', { is: 'page-header' }) as PageHeader;
if (!document.body.layoutInstance || !document.body.header) {
    throw new Error('Error initializing HTML Layouts - page cannot be charged.');
}

document.body.append(document.body.header, document.body.layoutInstance);
router.loadRoute(router.currentPath, true);
