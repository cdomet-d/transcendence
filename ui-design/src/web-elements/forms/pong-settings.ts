import { createDropdown } from '../navigation/menu-helpers';
import { DropdownMenu } from '../navigation/menus';
import { BaseForm } from './baseform';
import { backgroundMenu, search } from '../../default-values';
import { createHeading } from '../typography/helpers';
import type { Searchbar } from './search';
import { createSearchbar } from './helpers';
import type { UserData } from '../../types-interfaces';
import { createUserInline } from '../users/profile-helpers';

//TODO: Override parent submit event to append all relevant informations.

export class LocalPongSettings extends BaseForm {
    #backgroundSelector: DropdownMenu;

    get dropdownMenu() {
        return this.#backgroundSelector;
    }

    constructor() {
        super();
        this.#backgroundSelector = createDropdown(backgroundMenu, 'Select background', 'static');
    }

    override render() {
        const title = createHeading('1', super.details.heading);
        this.append(title);
        this.append(this.#backgroundSelector);
        this.renderFields();
        this.renderButtons();
    }
}

if (!customElements.get('local-pong-settings')) {
    customElements.define('local-pong-settings', LocalPongSettings, { extends: 'form' });
}

export class RemotePongSettings extends LocalPongSettings {
    #searchbar: Searchbar;
    #guestWrapper: HTMLDivElement;
    #invitedUsers: UserData[] | null;

    constructor() {
        super();

        this.#searchbar = createSearchbar(search);
        this.#guestWrapper = document.createElement('div');
        this.#invitedUsers = null;
    }

    set invitedUsers(users: UserData[]) {
        this.#invitedUsers = users;
        this.#displayInvitedUser();
    }

	clearResults() {
        while (this.#guestWrapper.firstChild) {
            this.#guestWrapper.removeChild(this.#guestWrapper.firstChild);
        }
    }
    #displayInvitedUser() {
		if (!this.#invitedUsers) return;
		if (this.#guestWrapper.firstChild) this.clearResults();
        this.#invitedUsers.forEach((user) => {
            this.#guestWrapper.append(createUserInline(user));
        });
    }

    styleFields() {
        this.#searchbar.classList.add('row-start-2', 'col-start-2');
        super.dropdownMenu.classList.add('row-start-5', 'col-start-1', 'row-span-2');
        super.contentMap['paddlespeed'].classList.add('col-start-1');
        super.contentMap['ballspeed'].classList.add('col-start-1');
        super.contentMap['paddlesize'].classList.add('col-start-1');
        super.contentMap['submit'].classList.add('row-start-6', 'col-start-2');
    }

    styleInviteList() {
        this.#guestWrapper.className =
            'brdr grid row-m gap-xs w-full pad-xs overflow-y-auto box-border row-start-3 col-start-2 row-span-3 place-self-stretch';
    }

    override render() {
		super.renderTitle();
		super.renderFields();
        this.append(this.#searchbar, this.#guestWrapper);
		this.append(super.dropdownMenu)
		super.renderButtons();
        this.styleFields();
        this.styleInviteList();
        this.classList.add('sidebar-left');
    }
}

if (!customElements.get('remote-pong-settings')) {
    customElements.define('remote-pong-settings', RemotePongSettings, { extends: 'form' });
}
