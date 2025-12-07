import type { GameType, friendNotif, gameNotif } from '../types-interfaces.js';
import { userStatus, type userStatusInfo } from '../../main.js';
import { createVisualFeedback, errorMessageFromException, exceptionFromResponse, redirectOnError } from '../../error.js';
import { userArrayFromAPIRes } from '../../api-responses/user-responses.js';
import { NotifContent } from './notification-content.js';
import { NotifToggle, NotifPanel } from './notif-panel-toggle.js';

//TODO: Make notifications tab-focusable
//TODO: Buttons are actually a form
//TODO: determine if we want to keep notifications forever or delete them as the users "validates" them.
// - if we keep them: set a timeout on the menu to avoid the user attempting to reach a lobby that was closed
// - if we don't keep them: how do we decide that the user processed the notification ?

/**
 * Defines the 'notif-container' custom element, which displays user notifications.
 *
 * @remarks
 * Aggregates {@link NotifToggle}, {@link NotifPanel}, and {@link NotifContent} components.
 * Handles friend requests and game invitations.
 * Manages notification polling and interface updates on user interaction.
 */
export class NotifBox extends HTMLDivElement {
	#toggle: NotifToggle;
	#panel: NotifPanel;
	#ws: WebSocket | null;
	#blurHandler: (e: FocusEvent) => void;
	#clickHandler: (e: Event) => void;
	constructor() {
		super();
		this.role = 'combobox';
		this.#toggle = document.createElement('div', { is: 'notif-toggle' }) as NotifToggle;
		this.#panel = document.createElement('ul', { is: 'notif-panel' }) as NotifPanel;
		this.computePanelPos = this.computePanelPos.bind(this);
		this.#clickHandler = this.#clickImplementation.bind(this);
		this.#blurHandler = this.#focusOutImplementation.bind(this);
		this.#ws = null;
	}

	connectedCallback() {
		this.setAttribute('tabindex', '0');
		this.addEventListener('click', this.#clickHandler);
		this.addEventListener('focusout', this.#blurHandler);
		this.addEventListener('keydown', this.#clickHandler);
		window.addEventListener('resize', this.computePanelPos);
		window.addEventListener('scroll', this.computePanelPos);
		if (this.#ws === null) {
			this.notifWsRequest();
		}
		this.render();
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.#clickHandler);
		this.removeEventListener('focusout', this.#blurHandler);
		this.removeEventListener('keydown', this.#clickHandler);
		window.removeEventListener('resize', this.computePanelPos);
		window.removeEventListener('scroll', this.computePanelPos);
	}

	/** Renders the toggle and panel elements inside the main wrapper. */
	render() {
		this.append(this.#toggle, this.#panel);

		this.id = 'notificationWrapper';
		this.className = 'relative box-border flex items-start';
	}

	/** Computes and updates the position of the notification popup relative to the toggle button. */
	computePanelPos() {
		const pos = this.#toggle.getBoundingClientRect();
		const popupWidth = this.#panel.offsetWidth;
		const pOffsetLeft = pos.left - (popupWidth + 24);
		this.#panel.style.setProperty('--panel-left', `${pOffsetLeft}px`);
		this.#panel.style.setProperty('--panel-top', `${pos.top}px`);
	}

	#handleKeyboardEvent(e: KeyboardEvent) {
		const keyActions: Record<string, () => void> = {
			Enter: () => this.#panel?.expand(),
			Escape: () => this.#panel?.collapse(),
			Space: () => this.#panel?.expand(),
		};
		const action = keyActions[e.key];
		if (action) action();
	}

	/**
	 * Handles click events on the toggle icon, updating panel state and alert visibility.
	 *
	 * @param {MouseEvent} e - The triggered mouse event.
	 */
	#clickImplementation(e: Event) {
		try {
			const target = e.target as Element | null;
			console.log(target);
			if (!target || !this.contains(target)) return;
			if (e instanceof KeyboardEvent) this.#handleKeyboardEvent(e);
			else {
				this.#panel.hasAttribute('hidden') ? this.#panel.expand() : this.#panel.collapse();
			}
			this.#toggle.toggleAlert(this.#panel.checkUnreadNotification());
			this.computePanelPos();
		} catch (error) {
			console.error('Could not handle notification click', error);
		}
	}

	#focusOutImplementation(e?: FocusEvent) {
		if (!e) {
			this.#panel.collapse();
		} else {
			const newFocus = e.relatedTarget as HTMLElement | null;
			if (!newFocus || !this.contains(newFocus)) {
				this.#panel.collapse();
			}
		}
	}

	/**
	 * Creates and displays a new friend request notification.
	 *
	 * @param {string} username - The username who sent the friend request.
	 */
	newFriendRequest(username: string) {
		const notif = document.createElement('li', { is: 'notif-content' }) as NotifContent;
		notif.createNotifMessage(username, 'sent you a friend request!');
		notif.id = 'relation';
		notif.requesterUsername = username;
		this.#panel.newNotification(notif);
		this.#toggle.toggleAlert(true);
	}

	/**
	 * Creates and displays a new game invitation notification.
	 *
	 * @param {string} username - The user who sent the invitation.
	 * @param {GameType} game - The type of game the user is invited to.
	 */
	newGameInvitation(username: string, game: GameType) {
		const notif = document.createElement('li', { is: 'notif-content' }) as NotifContent;
		notif.createNotifMessage(username, `challenged you to a ${game}!`);
		notif.id = 'game';
		// notif.lobbyInfo = GAMEINFO FROM SOMEWHERE I GUESS
		this.#panel.newNotification(notif);
		this.#toggle.toggleAlert(true);
	}

	async fetchPendingFriendRequests() {
		const status = await userStatus();
		if (!status.auth) redirectOnError('/auth', 'You must be registered to see this page');
		const url = `https://localhost:8443/api/bff/profile/${status.username}`;
		try {
			const rawRes = await fetch(url);
			if (!rawRes.ok) throw await exceptionFromResponse(rawRes);
			const res = await rawRes.json();
			const requests = userArrayFromAPIRes(res.pending);
			requests.forEach((r) => {
				this.newFriendRequest(r.username);
			});
		} catch (error) {
			console.error('[NOTIFICATIONS]', errorMessageFromException(error));
			createVisualFeedback(errorMessageFromException(error));
		}
	}

	async notifWsRequest() {
		const userStatusInfo: userStatusInfo = await userStatus();
		if (userStatusInfo.auth === false || userStatusInfo.userID === undefined) return;
		const userID: string = userStatusInfo.userID;
		const ws = new WebSocket(`wss://localhost:8443/notification/${userID}`);

		ws.onerror = () => {
			ws.close(1011, 'websocket error');
		};

		ws.onopen = () => {
			console.log('NOTIF webSocket connection established!');
			this.#ws = ws;
			ws.addEventListener('message', (event) => {
				const notif: friendNotif | gameNotif | string = JSON.parse(event.data);
				// console.log(`Received message: ${JSON.stringify(notif)}`);
				if (typeof notif === 'string' && notif === 'ping') ws.send(JSON.stringify('pong'));
				if (typeof notif === 'object') {
					if (notif.type === 'FRIEND_REQUEST') this.newFriendRequest(notif.senderUsername);
					else if (notif.type === 'GAME_INVITE') this.newGameInvitation(notif.receiverName, notif.gameType);
				}
			});
		};

		ws.onclose = (event) => {
			console.log('NOTIF webSocket connection closed!');
			//TODO: redirect on error ?
		};
	}

	get ws(): WebSocket | null {
		return this.#ws;
	}
}

if (!customElements.get('notif-container')) customElements.define('notif-container', NotifBox, { extends: 'div' });
