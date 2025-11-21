import { createButton } from './buttons-helpers.js';
import { createDropdown, createMenu } from './menu-helpers.js';
import { createForm } from '../forms/helpers.js';
import { createNotificationBox } from '../users/notifications-helpers.js';
import { CustomButton } from './buttons.js';
import { DropdownMenu } from './menus.js';
import { languageMenu, main, homeLink, logOut, logIn } from './default-menus.js';
import { Menu } from './basemenu.js';
import { NotifBox } from '../users/notifications.js';
import { router } from '../../main.js';
import { Searchbar } from '../forms/search.js';
import { userStatus } from '../../main.js';

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

    #loginHandler: () => void;
    #logoutHandler: () => void;

    constructor() {
        super();
        this.#home = createMenu(homeLink, 'horizontal', false);
        this.#searchbar = createForm('search-form');
        this.#mainNav = createMenu(main, 'horizontal', false);
        this.#notif = createNotificationBox();
        this.#language = createDropdown(languageMenu, 'Language', 'static');
        this.#logout = createButton(logOut, false);
        this.#login = createButton(logIn, false);

        this.#loginHandler = this.#loginImplementation.bind(this);
        this.#logoutHandler = this.#logoutImplementation.bind(this);
    }

    async #loginImplementation() {
        router.loadRoute('/auth');
    }

    async #logoutImplementation() {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        router.loadRoute('/');
    }

    connectedCallback() {
        this.append(this.#home, this.#searchbar, this.#mainNav, this.#notif, this.#language);
        this.#login.addEventListener('click', this.#loginHandler);
        this.#logout.addEventListener('click', this.#logoutHandler);
        this.render();
    }

    disconnectedCallback() {
        this.#login.removeEventListener('click', this.#loginHandler);
        this.#logout.removeEventListener('click', this.#logoutHandler);
    }

    async getLogState() {
        const log = await userStatus();

        if (log) {
            this.#login.remove();
            this.append(this.#logout);
            this.#logout.classList.add('h-m', 'w-l');
        } else {
            this.#logout.remove();
            this.append(this.#login);
            this.#login.classList.add('h-m', 'w-l');
        }
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
        this.#mainNav.classList.add('place-self-stretch');
    }
}

if (!customElements.get('page-header')) {
    customElements.define('page-header', PageHeader, { extends: 'header' });
}
