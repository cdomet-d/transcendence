import { createDropdown, createMenu } from './menu-helpers.js';
import { createForm } from '../forms/helpers.js';
import { createNotificationBox } from '../users/notifications-helpers.js';
import { DropdownMenu } from './menus.js';
import { NotifBox } from '../users/notifications.js';
import { Searchbar } from '../forms/search.js';
import { languageMenu, main, homeLink } from './default-menus.js';
import { Menu } from './basemenu.js';

/**
 * Custom element for the main page header.
 * Displays home icon, search bar, notifications, navigation menu, and language dropdown.
 * Extends HTMLElement.
 */
export class PageHeader extends HTMLElement {
    #home: Menu;
    #searchbar: Searchbar;
    #mainNav: Menu;
    #notif: NotifBox;
    #language: DropdownMenu;

    constructor() {
        super();
        this.#home = createMenu(homeLink, 'horizontal', false);
        this.#searchbar = createForm('search-form');
        this.#mainNav = createMenu(main, 'horizontal', false);
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
            'w-screen',
            'grid',
            'header',
            'grid-cols-5',
            'gap-xs',
            'absolute',
            'top-0',
            'left-0',
            'justify-between',
        );
    }
}

if (!customElements.get('page-header')) {
    customElements.define('page-header', PageHeader, { extends: 'header' });
}
