import { createDropdown, createMenu } from './menu-helpers';
import { createForm } from '../forms/helpers';
import { createIcon } from '../typography/helpers';
import { createNotificationBox } from '../users/notifications-helpers';
import { DropdownMenu, Menu } from './menus';
import { Icon } from '../typography/images';
import { iMeta } from '../../default-values';
import { NotifBox } from '../users/notifications';
import { Searchbar } from '../forms/search';
import { mainMenu, languageMenu } from './default-menus';

/**
 * Custom element for the main page header.
 * Displays home icon, search bar, notifications, navigation menu, and language dropdown.
 * Extends HTMLElement.
 */
export class PageHeader extends HTMLElement {
    #home: Icon;
    #searchbar: Searchbar;
    #mainNav: Menu;
    #notif: NotifBox;
    #language: DropdownMenu;

    constructor() {
        super();
        this.#home = createIcon(iMeta);
        this.#searchbar = createForm('search-form');
        this.#mainNav = createMenu(mainMenu, 'horizontal', 'm', false);
        this.#notif = createNotificationBox();
        this.#language = createDropdown(languageMenu, 'Language', 'static');
    }

    connectedCallback() {
        this.append(this.#home, this.#searchbar, this.#notif, this.#mainNav, this.#language);
        this.render();
    }

    render() {
        this.classList.add(
            'box-border',
            'w-full',
            'grid',
            'gap-xs',
            'header',
            'place-content-center',
        );
    }
}

if (!customElements.get('page-header')) {
    customElements.define('page-header', PageHeader, { extends: 'header' });
}
