import type { GameType, friendNotif, gameNotif } from '../types-interfaces.js';
import { userStatus, type userStatusInfo } from '../../main.js';
import {
	createVisualFeedback,
	errorMessageFromException,
	exceptionFromResponse,
	redirectOnError,
} from '../../error.js';
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

	constructor() {
		super();
		this.#toggle = document.createElement('div', { is: 'notif-toggle' }) as NotifToggle;
		this.#panel = document.createElement('div', { is: 'notif-panel' }) as NotifPanel;
		this.computePanelPos = this.computePanelPos.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.#ws = null;
	}

	connectedCallback() {
		this.addEventListener('click', this.handleClick);
		window.addEventListener('resize', this.computePanelPos);
		window.addEventListener('scroll', this.computePanelPos);
		if (this.#ws === null) {
			this.notifWsRequest();
		}
		this.render();
	}

	disconnectedCallback() {
		window.removeEventListener('resize', this.computePanelPos);
		window.removeEventListener('scroll', this.computePanelPos);
		this.removeEventListener('click', this.handleClick);
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

	/**
	 * Handles click events on the toggle icon, updating panel state and alert visibility.
	 *
	 * @param {MouseEvent} event - The triggered mouse event.
	 */
	handleClick(event: MouseEvent) {
		const target = event.target as Element | null;
		if (target && target.matches('#notifToggle')) {
			this.#panel.updateVisibility();
			this.#toggle.toggleAlert(this.#panel.checkUnreadNotification());
			this.computePanelPos();
		}
	}

	/**
	 * Creates and displays a new friend request notification.
	 *
	 * @param {string} username - The username who sent the friend request.
	 */
	newFriendRequest(username: string) {
		const notif = document.createElement('div', { is: 'notif-content' }) as NotifContent;
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
	newGameInvitation(gameNotif: gameNotif) {
		const notif = document.createElement('div', { is: 'notif-content' }) as NotifContent;
		notif.createNotifMessage(gameNotif.senderUsername, `challenged you to a ${gameNotif.gameType}!`);
		notif.id = 'game';
		notif.lobbyInfo = { lobbyID: gameNotif.lobbyID, inviteeID: gameNotif.receiverID, formInstance: gameNotif.gameType! };
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
					if (notif.type === 'FRIEND_REQUEST')
						this.newFriendRequest(notif.senderUsername);
					else if (notif.type === 'GAME_INVITE') {
						this.newGameInvitation(notif);
					}
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

if (!customElements.get('notif-container'))
	customElements.define('notif-container', NotifBox, { extends: 'div' });
