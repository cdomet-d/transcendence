import { backgroundMenu } from '../navigation/default-menus.js';
import { BaseForm } from './baseform.js';
import { createDropdown } from '../navigation/menu-helpers.js';
import { createForm } from './helpers.js';
import { createUserInline } from '../users/profile-helpers.js';
import { DropdownMenu } from '../navigation/menus.js';
import type { Searchbar } from './search.js';
import type { UserData } from '../types-interfaces.js';
import { createVisualFeedback, exceptionFromResponse, redirectOnError } from '../../error.js';
import { userDataFromAPIRes } from '../../api-responses/user-responses.js';
import { createNoResult } from '../typography/helpers.js';
import { wsConnect } from '../../lobby/wsConnect.front.js';
import { currentDictionary } from './language.js';
import { origin } from '../../main.js';
import { userStatus } from '../../main.js';

/**
 * A form allowing user to create a local pong game.
 *
 * @export
 * @class LocalPongSettings
 * @extends {BaseForm}
 * @remark customElement: `'local-pong-settings'`
 */
export class LocalPongSettings extends BaseForm {
	#backgroundSelector: DropdownMenu;
	#format: string;
	#formInstance: string;
	_guestLimit: number; // underscore is a convention in js to say protected
	#ws: WebSocket | null;

	/* -------------------------------------------------------------------------- */
	/*                                   Default                                  */
	/* -------------------------------------------------------------------------- */
	constructor() {
		super();
		this.#backgroundSelector = createDropdown(backgroundMenu, currentDictionary.gameCustom.choose_back, 'static');
		this.submitHandler = this.submitHandlerImplementation.bind(this);
		this.#format = "";
		this.#formInstance = "";
		this.#ws = null;
		this._guestLimit = 0;
	}

	/**
	 * Renders the local pong settings form.
	 * Appends the title, background selector, fields, and buttons.
	 */
	override render() {
		super.renderTitle();
		this.append(this.#backgroundSelector);
		this.renderFields();
		this.renderButtons();
		this.classList.add('sidebar-left');
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		const newRoute: string = window.location.pathname;
		if (this.#ws && newRoute !== "/game" && !newRoute.includes("-lobby"))//TODO: if brackets or winner/loser screen have routes, add them here
			this.#ws.close();
	}

	/* -------------------------------------------------------------------------- */
	/*                                   Getters                                  */
	/* -------------------------------------------------------------------------- */
	/**
	 * Gets the dropdown menu element for background selection.
	 */
	get dropdownMenu() {
		return this.#backgroundSelector;
	}

	/* -------------------------------------------------------------------------- */
	/*                                   Setters                                  */
	/* -------------------------------------------------------------------------- */
	set format(format: string) {
		this.#format = format;
		if (format === 'tournament')
			this._guestLimit = 4;
		else
			this._guestLimit = 2;
	}

	set formInstance(formInstance: string) {
		this.#formInstance = formInstance;
	}

	set socket(ws: WebSocket) {
		if (this.#ws === null)
			this.#ws = ws;
	}

	/* -------------------------------------------------------------------------- */
	/*                               Event listeners                              */
	/* -------------------------------------------------------------------------- */

	override async fetchAndRedirect(url: string, req: RequestInit): Promise<void> {
		console.log('Fetch&Redirect');
	}

	override async submitHandlerImplementation(ev: SubmitEvent): Promise<void> {
		ev.preventDefault();
		const f = new FormData(this);
		const background = this.#backgroundSelector.selectedElement;
		if (background) f.append('background', background.id);

		const req = this.initReq();
		req.body = await this.createReqBody(f);
		console.log(f);
		// await this.fetchAndRedirect(this.details.action, req);

		wsConnect('game', this.#format, this.#formInstance, '', req.body);
	}
}

if (!customElements.get('local-pong-settings')) {
	customElements.define('local-pong-settings', LocalPongSettings, { extends: 'form' });
}

/**
 * A form allowing user to create a local pong game.
 *
 * @export
 * @class RemotePongSettings
 * @extends {LocalPongSettings}
 * @remark customElement: `'remote-pong-settings'`
 */

// Perhaps we should add an invite button and a remove button ?
// TODO: Override searchbar submit event to add the the invited users to the guest list instead of loading their profile
// TODO: Add event listener on Searchbar's SUBMIT to capture invitations.
// TODO: Add API call to /api/user to get requested user and store it in an
// array of user that will be displayed in #guestWrapper
// TODO: track the number of invited users and allow form submission when there are 2, 4 or 8 players.
export class RemotePongSettings extends LocalPongSettings {
	#searchbar: Searchbar;
	#guestWrapper: HTMLDivElement;
	#guests: Map<string, UserData>;
	#owner: string;
	#inviteHandler: (ev: Event) => void;

	/* -------------------------------------------------------------------------- */
	constructor() {
		super();

		this.#searchbar = createForm('search-form');
		this.#guestWrapper = document.createElement('div');
		this.#guests = new Map<string, UserData>();
		this.#inviteHandler = this.#inviteImplementation.bind(this);
		this.#owner = '';
		super.contentMap.get('submit')?.setAttribute('disabled', '');
	}

	override async fetchAndRedirect(url: string, req: RequestInit): Promise<void> {
		console.log('Fetch&Redirect');
	}

	override async connectedCallback() {
		super.connectedCallback();
		this.#searchbar.addEventListener('click', this.#inviteHandler, { capture: true });
		const status = await userStatus();
		if (!status.auth) return redirectOnError('/auth', 'You must be registered to see this page');//TODO: maybe not necessary since it is checked in "renderlobbies"
		const user = await this.fetchGuests(status.username!);
		if (user) this.#guests.set(user.username, user);
		this.#displayGuests();
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.#searchbar.removeEventListener('click', this.#inviteHandler);
	}

	override render() {
		super.renderTitle();
		super.renderFields();
		this.append(super.dropdownMenu);
		this.append(this.#searchbar, this.#guestWrapper);
		super.renderButtons();
		this.styleFields();
		this.styleInviteList();
		this.#displayGuests();
		this.classList.add('sidebar-left');
	}

	enableStartButton() {
		super.contentMap.get('submit')?.removeAttribute('disabled');
	}

	disableSearchBar() {
		this.#searchbar.contentMap.get('searchbar')?.setAttribute('disabled', "");
	}//TODO: fix that

	set owner(o: string) {
		this.#owner = o;
	}
	/* -------------------------------- listeners ------------------------------- */
	async fetchGuests(guestUsername: string): Promise<UserData | null> {
		const url = `https://${origin}:8443/api/bff/tiny-profile/${guestUsername}`;
		try {
			const rawResp = await fetch(url);
			console.log(rawResp.ok);
			if (!rawResp.ok) throw await exceptionFromResponse(rawResp);
			const resp = await rawResp.json();
			const user = userDataFromAPIRes(resp);
			return user;
		} catch (error) {
			throw error;
		}
	}

	async #inviteImplementation(ev: Event) {
		const target = ev.target as HTMLElement;
		if (target.tagName === 'A') {
			ev.preventDefault();
			ev.stopImmediatePropagation();
			if (target.title === this.#owner) {
				createVisualFeedback("You can't invite yourself");
				return;
			}
			if (this.#guests.size < this._guestLimit) {
				try {
					const user = await this.fetchGuests(target.title);
					if (user) this.#guests.set(user.username, user);
					wsConnect('invite', '', this.details.id, '', '', {userID: user!.id, username: user!.username});
					this.#displayGuests();
				} catch (error) {
					console.log(error);
				}
			} else {
				console.log('too many guests');
				if (target.title === this.#owner) createVisualFeedback("You can't invite yourself, dummy");
				else createVisualFeedback("You can't invite any more people!");
			}
		}
	}

	/* ---------------------------- guest management ---------------------------- */
	#clearGuests() {
		while (this.#guestWrapper.firstChild) {
			this.#guestWrapper.removeChild(this.#guestWrapper.firstChild);
		}
	}

	/**
	 * Displays the invited users in the guest wrapper.
	 * Appends user inline elements for each invited user.
	 * @private
	 */
	#displayGuests() {
		if (this.#guestWrapper.firstChild) this.#clearGuests();

		if (this.#guests.size < 1) {
			const el = createNoResult('light', 'ixl');
			this.#guestWrapper.append(el);
			el.classList.add('col-span-2');
		} else {
			this.#guests.forEach((user) => {
				this.#guestWrapper.append(createUserInline(user));
			});
		}
	}

	public async displayUpdatedGuests(whiteListUsernames: string[]) {
		this.#guests.clear();
		for (const username of whiteListUsernames) {
			const user = await this.fetchGuests(username);
			if (user) this.#guests.set(user.username, user);
		}
		this.#displayGuests();
	}

	/* --------------------------------- styling -------------------------------- */
	styleFields() {
		super.contentMap.get('title')?.classList.add('col-span-2');
		this.#searchbar.classList.add('row-start-3', 'col-start-2');
		super.dropdownMenu.classList.add('row-start-2', 'col-start-2');
		super.contentMap.get('paddlespeed')?.classList.add('col-start-1');
		super.contentMap.get('ballspeed')?.classList.add('col-start-1');
		super.contentMap.get('paddlesize')?.classList.add('col-start-1');
		super.contentMap.get('submit')?.classList.remove('w-full');
		super.contentMap.get('submit')?.classList.add('col-span-2', 'w-5/6');
	}

	styleInviteList() {
		this.#guestWrapper.className =
			'brdr pad-sm min-h-[190px] max-h-[214px] grid grid-cols-2 gap-s overflow-y-auto box-border \
			row-start-4 col-start-2 row-span-2 place-self-stretch';
	}
}

if (!customElements.get('remote-pong-settings')) {
	customElements.define('remote-pong-settings', RemotePongSettings, { extends: 'form' });
}
