import { backgroundMenu } from '../navigation/default-menus.js';
import { BaseForm } from './baseform.js';
import { createDropdown } from '../navigation/menu-helpers.js';
import { createForm } from './helpers.js';
import { createUserInline } from '../users/profile-helpers.js';
import { DropdownMenu } from '../navigation/menus.js';
import type { Searchbar } from './search.js';
import type { UserData } from '../types-interfaces.js';
import { createVisualFeedback, exceptionFromResponse } from '../../error.js';
import { userDataFromAPIRes } from '../../api-responses/user-responses.js';
import { createNoResult } from '../typography/helpers.js';
import { wsConnect } from '../../lobby/wsConnect.front.js';

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

    /* -------------------------------------------------------------------------- */
    /*                                   Default                                  */
    /* -------------------------------------------------------------------------- */
    constructor() {
        super();
        this.#backgroundSelector = createDropdown(backgroundMenu, 'Select background', 'static');
        this.submitHandler = this.submitHandlerImplementation.bind(this);
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
        req.body = this.createReqBody(f);
        console.log(f);
        // await this.fetchAndRedirect(this.details.action, req);

        wsConnect('game', 'quickmatch', 'localForm', '', req.body);
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
    }

    override async fetchAndRedirect(url: string, req: RequestInit): Promise<void> {
        console.log('Fetch&Redirect');
    }

    override connectedCallback() {
        super.connectedCallback();
        this.#searchbar.addEventListener('click', this.#inviteHandler, { capture: true });
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

    /* -------------------------------- listeners ------------------------------- */
    async fetchGuests(guestUsername: string): Promise<UserData | null> {
        const url = `https://localhost:8443/api/bff/tiny-profile/${guestUsername}`;
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
            // TODO: keep lobby owner from adding themselves to the lobby;
            //  && target.title !== this.#owner
            if (this.#guests.size < 4) {
                try {
                    const user = await this.fetchGuests(target.title);
                    if (user) this.#guests.set(user.username, user);
                    /**
                     * HERE @ElSamsam && @cmsweeting
                     * // TODO ask Charlotte how to send WS invite in front (and also ws.send invite to gm)
                     * When the lobby's owner adds a guest to the lobby, I fetch the associated data and store it in the guest Map to render it later.
                     * You can add whatever you need websocket wise HERE and send `user.username` to add the user to the lobby server-side.
                     */
                    wsConnect("invite", "", "", "", "", user!.id);//TODO: check user exists
                    this.#displayGuests();
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log('too many guests');
                if (target.title === this.#owner)
                    createVisualFeedback("You can't invite yourself, dummy");
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
            const el = createNoResult('light', 'ilarge');
            this.#guestWrapper.append(el);
            el.classList.add('col-span-2');
        } else {
            this.#guests.forEach((user) => {
                this.#guestWrapper.append(createUserInline(user));
            });
        }
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
            'brdr pad-sm max-h-[214px] grid grid-cols-2 gap-s overflow-y-auto box-border \
			row-start-4 col-start-2 row-span-2 place-self-stretch';
    }
}

if (!customElements.get('remote-pong-settings')) {
    customElements.define('remote-pong-settings', RemotePongSettings, { extends: 'form' });
}
