import { createDropdown, createNavMenu } from './menu-helpers.js';
import { createForm } from '../forms/helpers.js';
import { createIcon } from '../typography/helpers.js';
import { createNotificationBox } from '../users/notifications-helpers.js';
import { DropdownMenu, NavigationMenu } from './menus.js';
import { Icon } from '../typography/images.js';
import { iMeta } from '../default-values.js';
import { NotifBox } from '../users/notifications.js';
import { Searchbar } from '../forms/search.js';
import { mainMenu, languageMenu } from './default-menus.js';

/**
 * Custom element for the main page header.
 * Displays home icon, search bar, notifications, navigation menu, and language dropdown.
 * Extends HTMLElement.
 */
export class PageHeader extends HTMLElement {
    #home: Icon;
    #searchbar: Searchbar;
    #mainNav: NavigationMenu;
	#notif: NotifBox;
    #language: DropdownMenu;

    constructor() {
        super();
        this.#home = createIcon(iMeta);
        this.#searchbar = createForm('search-form');
        this.#mainNav = createNavMenu(mainMenu, 'horizontal', false);
        this.#notif = createNotificationBox();
        this.#language = createDropdown(languageMenu, 'Language', 'static');
    }

    connectedCallback() {
        this.append(this.#home, this.#searchbar, this.#mainNav, this.#language, this.#notif);
        this.render();
    }

    render() {
        this.classList.add(
            'box-border',
			'pad-xs',
            'w-full',
            'grid',
            'gap-xs',
            'header',
			'fixed',
			'top-0',
			'left-0',
			'justify-evenly'
        );
    }
}

if (!customElements.get('page-header')) {
    customElements.define('page-header', PageHeader, { extends: 'header' });
}
