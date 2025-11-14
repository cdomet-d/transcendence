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

    /**
     * Gets the dropdown menu element for background selection.
     */
    get dropdownMenu() {
        return this.#backgroundSelector;
    }

    override async submitHandlerImplementation(ev: SubmitEvent): Promise<void> {
        ev.preventDefault();
        const f = new FormData(this);
        const background = this.#backgroundSelector.selectedElement;

        if (background) f.append('background', background.id);
        const req = this.initReq();
        req.body = this.createReqBody(f);
        await this.sendForm(this.details.action, req);
    }
    constructor() {
        super();
        this.#backgroundSelector = createDropdown(backgroundMenu, 'Select background', 'static');
        this.submitHandler = this.submitHandlerImplementation.bind(this);
    }

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
    #invitedUsers: UserData[] | null;
    // #inviteHandler: (ev: SubmitEvent) => void

    constructor() {
        super();

        this.#searchbar = createForm('search-form');
        this.#guestWrapper = document.createElement('div');
        this.#invitedUsers = null;
        // this.#inviteHandler = this.#inviteHandlerImplementation.bind(this);
    }

    // #inviteHandlerImplementation(ev: SubmitEvent) {
    // 	ev.preventDefault();
    // 	const form = new FormData(this.#searchbar);
    // 	console.log(form);
    // }

    override connectedCallback(): void {
        super.connectedCallback();
        // this.#searchbar.addEventListener('submit', this.#inviteHandler)
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        // this.#searchbar.removeEventListener('submit', this.#inviteHandler)
    }
    /**
     * Sets the invited users and updates the guest list display.
     * @param users - Array of invited user data.
     */
    set invitedUsers(users: UserData[]) {
        this.#invitedUsers = users;
        this.#displayInvitedUsers();
    }

    /**
     * Clears all children from the guest wrapper element, ensure no guest is displayed twice when refreshing the view.
     */
    #clearResults() {
        while (this.#guestWrapper.firstChild) {
            this.#guestWrapper.removeChild(this.#guestWrapper.firstChild);
        }
    }

    /**
     * Displays the invited users in the guest wrapper.
     * Appends user inline elements for each invited user.
     * @private
     */
    #displayInvitedUsers() {
        if (this.#guestWrapper.firstChild) this.#clearResults();

        if (!this.#invitedUsers || this.#invitedUsers.length < 1) {
            this.#guestWrapper.append(
                document.createElement('div', { is: 'no-results' }) as NoResults,
            );
        } else {
            this.#invitedUsers.forEach((user) => {
                this.#guestWrapper.append(createUserInline(user));
            });
        }
    }

    /**
     * Applies custom styles to form fields and buttons.
     */
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

    /**
     * Applies custom styles to the invite list wrapper.
     */
    styleInviteList() {
        this.#guestWrapper.className =
            'brdr grid row-m gap-xs pad-xs overflow-y-auto box-border row-start-3 col-start-2 row-span-2 place-self-stretch';
    }

    /**
     * Renders the remote pong settings form.
     * Appends the title, fields, search bar, guest wrapper, dropdown menu, and buttons.
     * Applies custom styles to fields and invite list.
     */
    override render() {
        super.renderTitle();
        super.renderFields();
        this.append(this.#searchbar, this.#guestWrapper);
        this.append(super.dropdownMenu);
        super.renderButtons();
        this.styleFields();
        this.styleInviteList();
        this.#displayInvitedUsers();
        this.classList.add('sidebar-left');
    }
}

if (!customElements.get('remote-pong-settings')) {
    customElements.define('remote-pong-settings', RemotePongSettings, { extends: 'form' });
}
