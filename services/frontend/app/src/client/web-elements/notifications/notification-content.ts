import { createLink } from '../navigation/buttons-helpers.js';
import { createMenu } from '../navigation/menu-helpers.js';
import { Menu } from '../navigation/basemenu.js';
import type { MenuData } from '../types-interfaces.js';
import type { NavigationLinksData } from '../types-interfaces.js';
import {
	createVisualFeedback,
	errorMessageFromException,
	exceptionFromResponse,
} from '../../error.js';

interface GameInvite {
	action: string;
	format: string;
	formInstance: string;
	lobbyID: string;
	inviteeID: string;
	gameSettings: string;
}

const notificationBtns: MenuData = {
	id: 'notificationMenu',
	buttons: [
		{
			id: 'decline',
			type: 'button',
			content: 'Decline',
			img: null,
			ariaLabel: 'Decline invitation',
			style: 'red',
		},
		{
			id: 'accept',
			type: 'button',
			content: 'Accept',
			img: null,
			ariaLabel: 'Accept invitation',
			style: 'green',
		},
	],
};

/**
 * Represents a single notification entry inside the panel.
 *
 * @remarks
 * Displays a short message and includes buttons created from {@link notificationBtns}.
 * The element is rendered as a grid with text and action buttons.
 */

export class NotifContent extends HTMLDivElement {
	#acceptHandler: (e: Event) => void;
	#declineHandler: (e: Event) => void;

	#menu: Menu;
	#message: HTMLSpanElement;

	#requesterUsername: string;
	#lobbyInfo: GameInvite | null;

	constructor() {
		super();
		this.#message = document.createElement('span');
		this.#menu = createMenu(notificationBtns, 'horizontal');

		this.#acceptHandler = this.#acceptImplementation.bind(this);
		this.#declineHandler = this.#declineImplementation.bind(this);

		this.#requesterUsername = '';
		this.#lobbyInfo = null;
	}

	set requesterUsername(str: string) {
		this.#requesterUsername = str;
	}

	set lobbyInfo(obj: GameInvite) {
		this.#lobbyInfo = obj;
	}

	createNotifMessage(profile: string, mess: string) {
		const linkData: NavigationLinksData = {
			styleButton: false,
			id: 'requester',
			datalink: profile,
			href: `/user/${profile}`,
			title: profile,
			img: null,
		};
		const a = createLink(linkData);
		const p = document.createElement('p');

		p.innerText = mess;
		this.#message.append(a, p);
		p.className = 'box-border pad-xs';
	}

	async #acceptRelation() {
		console.log(this.#requesterUsername);
		const url = 'https://localhost:8443/api/bff/relation';
		const body = { username: `${this.#requesterUsername}` };
		const jbody = JSON.stringify(body);
		const req: RequestInit = {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: jbody,
		};

		try {
			const raw = await fetch(url, req);
			if (!raw.ok) throw await exceptionFromResponse(raw);
			const res = await raw.json();
			createVisualFeedback(res.message, 'success');
		} catch (error) {
			console.error('[ACCEPT RELATION]', errorMessageFromException(error));
			createVisualFeedback(errorMessageFromException(error));
		}
	}

	async #declineRelation() {
		const url = 'https://localhost:8443/api/bff/relation';
		const body = { username: `${this.#requesterUsername}` };
		const jbody = JSON.stringify(body);
		const req: RequestInit = {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: jbody,
		};

		try {
			const raw = await fetch(url, req);
			if (!raw.ok) throw await exceptionFromResponse(raw);
			const res = await raw.json();
			createVisualFeedback(res.message, 'success');
		} catch (error) {
			console.error('[DECLINE RELATION]', errorMessageFromException(error));
			createVisualFeedback(errorMessageFromException(error));
		}
	}

	#joinGame() {}

	#declineGame() {}

	#acceptImplementation(e: Event) {
		this.id === 'relation' ? this.#acceptRelation() : this.#joinGame();
	}

	#declineImplementation(e: Event) {
		this.id === 'relation' ? this.#declineRelation() : this.#declineGame();
	}

	/** Called when the element is connected; renders text and buttons within the container. */
	connectedCallback() {
		this.append(this.#message, this.#menu);
		this.#menu.cache.get('accept')?.addEventListener('click', this.#acceptHandler);
		this.#menu.cache.get('decline')?.addEventListener('click', this.#declineHandler);
		this.render();
	}

	disconnectedCallback() {
		this.#menu.cache.get('accept')?.removeEventListener('click', this.#acceptHandler);
		this.#menu.cache.get('decline')?.removeEventListener('click', this.#declineHandler);
	}

	render() {
		this.#menu.listbox.classList.add('row-s');
		this.#message.className = 'inline-flex justify-center';
		this.className = 'grid notif-cols gap-s';
	}
}

if (!customElements.get('notif-content')) {
	customElements.define('notif-content', NotifContent, { extends: 'div' });
}
