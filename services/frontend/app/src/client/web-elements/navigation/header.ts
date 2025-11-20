import { createButton } from './buttons-helpers.js';
import { createDropdown, createMenu } from './menu-helpers.js';
import { createForm } from '../forms/helpers.js';
import { createNotificationBox } from '../users/notifications-helpers.js';
import { CustomButton } from './buttons.js';
import { DropdownMenu } from './menus.js';
import { languageMenu, main, homeLink, logOut, logIn } from './default-menus.js';
import { Menu } from './basemenu.js';
import { NotifBox } from '../users/notifications.js';
import { Searchbar } from '../forms/search.js';

/**
 * Custom element for the main page header.
 * Displays home icon, search bar, notifications, navigation menu, and language dropdown.
 * Extends HTMLElement.
 */
export class PageHeader extends HTMLElement {
    #home: Menu;
    #searchbar: Searchbar;
    #mainNav: Menu;
    #logout: CustomButton;
	#login: CustomButton;
    #notif: NotifBox;
    #language: DropdownMenu;

    constructor() {
        super();
        this.#home = createMenu(homeLink, 'horizontal', false);
        this.#searchbar = createForm('search-form');
        this.#mainNav = createMenu(main, 'horizontal', false);
        this.#notif = createNotificationBox();
        this.#language = createDropdown(languageMenu, 'Language', 'static');
        this.#logout = createButton(logOut, false);
        this.#login = createButton(logIn, false);
    }

    connectedCallback() {
        this.append(this.#home, this.#searchbar, this.#mainNav, this.#notif, this.#language, this.#login);
        this.render();
    }

    render() {
        this.classList.add(
            'box-border',
            'w-screen',
            'grid',
            'header',
            'grid-cols-5',
            'gap-m',
            'absolute',
            'top-0',
            'left-0',
            'justify-between',
            'z-1',
        );

		//TODO: dynamic login/logout button depending on user connection status
		
        this.#mainNav.classList.add('place-self-stretch');
        this.#logout.classList.add('h-m', 'w-l', 'hidden');
        this.#login.classList.add('h-m', 'w-l');
    }
}

if (!customElements.get('page-header')) {
    customElements.define('page-header', PageHeader, { extends: 'header' });
}
