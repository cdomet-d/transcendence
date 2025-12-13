import { loadHistoryLocation } from './event-listeners.js';
import { Layout } from './web-elements/layouts/layout.js';
import { PageHeader } from './web-elements/navigation/header.js';
import { Router, routes } from './router.js';
import { errorMessageFromException, redirectOnError } from './error.js';
import { currentDictionary, initLanguage } from './web-elements/forms/language.js';
import type { NavigationLinks } from './web-elements/navigation/links.js';
import type { NavigationLinksData } from './web-elements/types-interfaces.js';
import { createLink } from './web-elements/navigation/buttons-helpers.js';
import './css/tailwind.css';
export const router = new Router(routes);

declare global {
	interface HTMLElement {
		layoutInstance: Layout | undefined;
		header: PageHeader | undefined;
		footer: HTMLElement | undefined;
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
		const isLogged: Response = await fetch(`https://${API_URL}:8443/api/auth/status`, { credentials: 'include' });
		const data = await isLogged.json();
		console.log(data);
		if (isLogged.ok) return { auth: true, username: data.username, userID: data.userID };
		else {
			return { auth: false };
		}
	} catch (error) {
		redirectOnError('/404', errorMessageFromException(`[USER STATUS FAILED]` + error));
		return { auth: false };
	}
}

function linkGRPD(): NavigationLinks {
	const grpd: NavigationLinksData = { styleButton: false, id: 'privacy', datalink: '/privacy', href: '/privacy', title: currentDictionary.buttons.privacy, img: null };
	return createLink(grpd, false);
}

async function startApp() {
	try {
		await initLanguage();
		document.body.layoutInstance = document.createElement('main', { is: 'custom-layout' }) as Layout;
		document.body.header = document.createElement('header', { is: 'page-header' }) as PageHeader;
		document.body.footer = document.createElement('footer');
		if (!document.body.layoutInstance || !document.body.header || !document.body.footer) throw new Error('Error initializing HTML Layouts - page cannot be charged.');
		document.body.append(document.body.header, document.body.layoutInstance, document.body.footer);
		document.body.footer.append(linkGRPD());
		router.loadRoute(router.currentPath, true);
	} catch (e) {
		console.error(errorMessageFromException(e));
	}
}

startApp();
