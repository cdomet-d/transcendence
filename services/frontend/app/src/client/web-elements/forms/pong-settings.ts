import { backgroundMenu } from '../navigation/default-menus.js';
import { BaseForm } from './baseform.js';
import { createDropdown } from '../navigation/menu-helpers.js';
import { createForm } from './helpers.js';
import { createUserInline } from '../users/profile-helpers.js';
import { DropdownMenu } from '../navigation/menus.js';
import { NoResults } from '../typography/images.js';
import type { Searchbar } from './search.js';
import type { UserData } from '../types-interfaces.js';

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
        this.renderFields();
        this.append(this.#backgroundSelector);
        this.renderButtons();
        this.styleFields();
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

    override async submitHandlerImplementation(ev: SubmitEvent): Promise<void> {
        ev.preventDefault();
        const f = new FormData(this);
        const background = this.#backgroundSelector.selectedElement;

        if (background) f.append('background', background.id);
        const req = this.initReq();
        req.body = this.createReqBody(f);
        await this.sendForm(this.details.action, req);
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Rendering                                 */
    /* -------------------------------------------------------------------------- */

    styleFields() {
        super.contentMap.get('title')?.classList.add('col-span-2');
        super.contentMap.get('paddlesize')?.classList.add('col-start-1');
        super.contentMap.get('paddlespeed')?.classList.add('col-start-1');
        super.contentMap.get('ballspeed')?.classList.add('col-start-1');
        super.contentMap.get('opponent')?.classList.add('row-start-2', 'col-start-2');
        this.#backgroundSelector.classList.add('row-start-3', 'col-start-2');
        super.contentMap.get('submit')?.classList.remove('w-full');
        super.contentMap.get('submit')?.classList.add('row-start-5', 'col-span-2', 'w-5/6');
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
    #guests: UserData[] | null;
    // #inviteHandler: (ev: SubmitEvent) => void

    /* -------------------------------------------------------------------------- */
    /*                                   Default                                  */
    /* -------------------------------------------------------------------------- */
    constructor() {
        super();

        this.#searchbar = createForm('search-form');
        this.#guestWrapper = document.createElement('div');
        this.#guests = null;
        // this.#inviteHandler = this.#inviteHandlerImplementation.bind(this);
    }

    override connectedCallback(): void {
        super.connectedCallback();
        // this.#searchbar.addEventListener('submit', this.#inviteHandler)
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        // this.#searchbar.removeEventListener('submit', this.#inviteHandler)
    }

    override render() {
        super.renderTitle();
        super.renderFields();
        this.append(this.#searchbar, this.#guestWrapper);
        this.append(super.dropdownMenu);
        super.renderButtons();
        this.styleFields();
        this.styleInviteList();
        this.#displayGuests();
        this.classList.add('sidebar-left');
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Setters                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Sets the invited users and updates the guest list display.
     * @param users - Array of invited user data.
     */
    set guests(users: UserData[]) {
        this.#guests = users;
        this.#displayGuests();
    }

    /* -------------------------------------------------------------------------- */
    /*                               Event listeners                              */
    /* -------------------------------------------------------------------------- */
    // #inviteHandlerImplementation(ev: SubmitEvent) {
    // 	ev.preventDefault();
    // 	const form = new FormData(this.#searchbar);
    // 	console.log(form);
    // }

    /* -------------------------------------------------------------------------- */
    /*                              Guest Management                              */
    /* -------------------------------------------------------------------------- */
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

        if (!this.#guests || this.#guests.length < 1) {
            this.#guestWrapper.append(
                document.createElement('div', { is: 'no-results' }) as NoResults,
            );
        } else {
            this.#guests.forEach((user) => {
                this.#guestWrapper.append(createUserInline(user));
            });
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Styling                                  */
    /* -------------------------------------------------------------------------- */
    override styleFields() {
        super.contentMap.get('title')?.classList.add('col-span-2');
        this.#searchbar.classList.add('row-start-2', 'col-start-2');
        super.dropdownMenu.classList.add('row-start-5', 'col-start-1');
        super.contentMap.get('paddlespeed')?.classList.add('col-start-1');
        super.contentMap.get('ballspeed')?.classList.add('col-start-1');
        super.contentMap.get('paddlesize')?.classList.add('col-start-1');
        super.contentMap.get('submit')?.classList.remove('w-full');
        super.contentMap.get('submit')?.classList.add('row-start-5', 'col-span-2', 'w-5/6');
    }

    styleInviteList() {
        this.#guestWrapper.className =
            'brdr grid row-m gap-xs pad-xs overflow-y-auto box-border \
			row-start-3 col-start-2 row-span-2 place-self-stretch';
    }
}

if (!customElements.get('remote-pong-settings')) {
    customElements.define('remote-pong-settings', RemotePongSettings, { extends: 'form' });
}
