import { createDropdown, createNavMenu } from './menu-helpers.js';
import { createForm } from '../forms/helpers.js';
import { createNotificationBox } from '../users/notifications-helpers.js';
import { DropdownMenu, NavigationMenu } from './menus.js';
import { NotifBox } from '../users/notifications.js';
import { Searchbar } from '../forms/search.js';
import { mainMenu, languageMenu } from './default-menus.js';
import type { navigationLinksData } from '../types-interfaces.js';

const homeLink: navigationLinksData[] = [
    {
        datalink: 'home',
        href: '/',
        title: 'Home',
        img: {
            alt: 'A cute pixel art blob',
            size: 'imedium',
            src: '/public/images/default-avatar.png',
            id: 'home-link',
        },
    },
];

/**
 * Custom element for the main page header.
 * Displays home icon, search bar, notifications, navigation menu, and language dropdown.
 * Extends HTMLElement.
 */
export class PageHeader extends HTMLElement {
    #home: NavigationMenu;
    #searchbar: Searchbar;
    #mainNav: NavigationMenu;
    #notif: NotifBox;
    #language: DropdownMenu;

    constructor() {
        super();
        this.#home = createNavMenu(homeLink, 'horizontal', false);
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
