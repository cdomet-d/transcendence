import { loadHistoryLocation } from './event-listeners.js';
import { Layout } from './web-elements/layouts/layout.js';
import { PageHeader } from './web-elements/navigation/header.js';
import { Router, routes } from './router.js';
import { createErrorFeedback } from './web-elements/event-elements/error.js';

// import { pong } from './game/pong.js';
// import { addLanguageEvents } from './language/languageEvents.js';
// import { initLanguageCSR } from './language/translation.js';

export const router = new Router(routes);

declare global {
    interface HTMLElement {
        layoutInstance: Layout | undefined;
        header: PageHeader | undefined;
    }
}

interface userStatusInfo {
    auth: boolean;
    username?: string;
    userID?: number;
}

if (window) {
    window.addEventListener('popstate', loadHistoryLocation);
}

export async function userStatus(): Promise<userStatusInfo> {
    try {
        const isLogged: Response = await fetch('/api/auth/status');
        const data = await isLogged.json();
        console.log(data);
        if (isLogged.ok) return { auth: true, username: data.username, userID: data.userID };
        else return { auth: false };
    } catch (error) {
        let mess = 'Something when wrong';
        if (error instanceof Error) mess = error.message;
		createErrorFeedback(mess);
        return { auth: false };
    }
}

document.body.layoutInstance = document.createElement('div', { is: 'custom-layout' }) as Layout;
document.body.header = document.createElement('header', { is: 'page-header' }) as PageHeader;
if (!document.body.layoutInstance || !document.body.header) {
    throw new Error('Error initializing HTML Layouts - page cannot be charged.');
}

document.body.append(document.body.header, document.body.layoutInstance);
router.loadRoute(router.currentPath, true);

// initLanguageCSR();
// addLanguageEvents();
