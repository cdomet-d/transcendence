import { createButton } from './buttons-helpers.js';
import { createMenu } from './menu-helpers.js';
import { createForm } from '../forms/helpers.js';
import { createNotificationBox } from '../notifications/notifications-helpers.js';
import { CustomButton } from './buttons.js';
import { main, homeLink, logOut, logIn } from './default-menus.js';
import { Menu } from './basemenu.js';
import { NotifBox } from '../notifications/notifications-wrapper.js';
import { router } from '../../main.js';
import { Searchbar } from '../forms/search.js';
import { userStatus } from '../../main.js';
import { currentDictionary } from '../forms/language.js';

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

	#loginHandler: () => void;
	#logoutHandler: () => void;

    constructor() {
        super();
        this.#home = createMenu(homeLink(currentDictionary), 'horizontal', false);
        this.#searchbar = createForm('search-form');
        this.#mainNav = createMenu(main(currentDictionary), 'horizontal', false);
        this.#notif = createNotificationBox();
        this.#logout = createButton(logOut(currentDictionary), false);
        this.#login = createButton(logIn(currentDictionary), false);

		this.#loginHandler = this.#loginImplementation.bind(this);
		this.#logoutHandler = this.#logoutImplementation.bind(this);
	}

	async #loginImplementation() {
		router.loadRoute('/auth', true);
	}

    async #logoutImplementation() {
/*         const userState = await userStatus();
        if (!userState.auth) return ;
        const userID = userState.userID */
        
        const url = `https://localhost:8443/api/auth/logout`;

        await fetch(url, { method: 'POST', credentials: 'include' });
        this.#notif.ws?.close();
        router.loadRoute('/', true);
    }

	connectedCallback() {
		this.append(this.#home, this.#searchbar, this.#mainNav, this.#notif);
		this.#login.addEventListener('click', this.#loginHandler);
		this.#logout.addEventListener('click', this.#logoutHandler);
		this.render();
	}

	disconnectedCallback() {
		this.#login.removeEventListener('click', this.#loginHandler);
		this.#logout.removeEventListener('click', this.#logoutHandler);
	}

	async getLogState(): Promise<void> {
		const log = await userStatus();
		if (log.auth) {
			if (this.contains(this.#login)) this.#login.remove();
			if (!this.contains(this.#logout)) {
				this.append(this.#logout);
				this.#logout.classList.add('h-m', 'w-l');
			}
			await this.#notif.fetchPendingFriendRequests();
		} else {
			if (this.contains(this.#logout)) this.#logout.remove();
			if (!this.contains(this.#login)) {
				this.append(this.#login);
				this.#login.classList.add('h-m', 'w-l');
			}
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

	get notif(): NotifBox {
		return this.#notif;
	}
}

if (!customElements.get('page-header')) {
	customElements.define('page-header', PageHeader, { extends: 'header' });
}
