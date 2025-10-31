import { backgroundMenu } from '../navigation/default-menus';
import { BaseForm } from './baseform';
import { createDropdown } from '../navigation/menu-helpers';
import { createForm } from './helpers';
import { createUserInline } from '../users/profile-helpers';
import { DropdownMenu } from '../navigation/menus';
import { NoResults } from '../typography/images';
import type { Searchbar } from './search';
import type { UserData } from '../../types-interfaces';

//TODO: Override parent submit event to append all relevant informations.

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

    constructor() {
        super();
        this.#backgroundSelector = createDropdown(backgroundMenu, 'Select background', 'static');
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
export class RemotePongSettings extends LocalPongSettings {
    #searchbar: Searchbar;
    #guestWrapper: HTMLDivElement;
    #invitedUsers: UserData[] | null;

    constructor() {
        super();

        this.#searchbar = createForm('search-form');
        this.#guestWrapper = document.createElement('div');
        this.#invitedUsers = null;
    }

    /**
     * Sets the invited users and updates the guest list display.
     * @param users - Array of invited user data.
     */
    set invitedUsers(users: UserData[]) {
        this.#invitedUsers = users;
        this.#displayInvitedUser();
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
    #displayInvitedUser() {
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
    styleFields() {
        this.#searchbar.classList.add('row-start-2', 'col-start-2');
        super.dropdownMenu.classList.add('row-start-5', 'col-start-1');
        super.contentMap['paddlespeed'].classList.add('col-start-1');
        super.contentMap['ballspeed'].classList.add('col-start-1');
        super.contentMap['paddlesize'].classList.add('col-start-1');
        super.contentMap['submit'].classList.add('row-start-5', 'col-start-2');
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
        this.#displayInvitedUser();
        this.classList.add('sidebar-left');
    }
}

if (!customElements.get('remote-pong-settings')) {
    customElements.define('remote-pong-settings', RemotePongSettings, { extends: 'form' });
}
