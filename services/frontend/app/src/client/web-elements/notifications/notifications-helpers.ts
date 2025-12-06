import { NotifBox } from './notifications-wrapper.js';

export function createNotificationBox(): NotifBox {
	const el = document.createElement('div', { is: 'notif-container' }) as NotifBox;
	return el;
}

/**
 * Asynchronously retrieves the search bar element by its ID.
 *
 * Waits up to 1000 milliseconds for an element with ID 'searchbar' to appear in the DOM.
 * Checks repeatedly every 100 milliseconds until found or timeout elapses.
 *
 * @returns {Promise<Searchbar | null>} A promise that resolves with the {@link Searchbar} element if found, or `null` if not found within the timeout.
 */
export function getNotificationBoxAsync(): Promise<NotifBox | null> {
	const timeout: number = 1000;
	const start = Date.now();
	return new Promise((resolve) => {
		function resolveSearchbar() {
			const s = document.getElementById('notificationWrapper') as NotifBox | null;
			if (s) {
				resolve(s);
			} else {
				if (Date.now() - start >= timeout) resolve(null);
				else setTimeout(resolveSearchbar, 100);
			}
		}
		resolveSearchbar();
	});
}
