import { createButton } from './buttons-helpers.js';
import { createMenu } from './menu-helpers.js';
import { createForm } from '../forms/helpers.js';
import { createNotificationBox } from '../notifications/notifications-helpers.js';
import { CustomButton } from './buttons.js';
import { main, homeLink, logOut, logIn } from './default-menus.js';
import { Menu } from './basemenu.js';
import { NotifBox } from '../notifications/notifications-wrapper.js';
import { router, type userStatusInfo } from '../../main.js';
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

	#loginHandler: () => void;
	#logoutHandler: () => void;

	static get observedAttributes() {
		return ['hidden'];
	}
	constructor() {
		super();
		this.#home = createMenu(homeLink(), 'horizontal', false);
		this.#searchbar = createForm('search-form');
		this.#mainNav = createMenu(main(), 'horizontal', false);
		this.#notif = createNotificationBox();
		this.#logout = createButton(logOut(), false);
		this.#login = createButton(logIn(), false);
		this.#loginHandler = this.#loginImplementation.bind(this);
		this.#logoutHandler = this.#logoutImplementation.bind(this);
	}

	async #loginImplementation() {
		router.loadRoute('/auth', true);
	}

	async #logoutImplementation() {
		await fetch(`https://${API_URL}:8443/api/auth/logout`, { method: 'POST', credentials: 'include' });
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

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) return;
		const children = Array.from(this.children);
		if (name === 'hidden' && !oldValue) {
			children.forEach((element) => {
				element.setAttribute('tabindex', '-1');
			});
		} else if (name === 'hidden' && !newValue) {
			children.forEach((element) => {
				element.removeAttribute('tabindex');
			});
			this.#notif.setAttribute('tabindex', '0');
		}
	}

	async getLogState(): Promise<userStatusInfo> {
		const log = await userStatus();
		if (log.auth) {
			if (this.contains(this.#login)) this.#login.remove();
			if (!this.contains(this.#logout)) {
				this.append(this.#logout);
				this.#logout.classList.add('h-m');
			}
		} else {
			if (this.contains(this.#logout)) this.#logout.remove();
			if (!this.contains(this.#login)) {
				this.append(this.#login);
				this.#login.classList.add('h-m');
			}
		}
		return log;
	}

	reloadLanguage() {
		const newHome = createMenu(homeLink(), 'horizontal', false);
		this.#home.replaceWith(newHome);
		this.#home = newHome;

		const newMainNav = createMenu(main(), 'horizontal', false);
		newMainNav.classList.add('place-self-stretch'); // Restore layout class
		this.#mainNav.replaceWith(newMainNav);
		this.#mainNav = newMainNav;

		const newSearch = createForm('search-form');
		this.#searchbar.replaceWith(newSearch);
		this.#searchbar = newSearch;

		const newLogout = createButton(logOut(), false);
		newLogout.addEventListener('click', this.#logoutHandler);
		if (this.contains(this.#logout)) {
			this.#logout.replaceWith(newLogout);
			if (this.#logout.classList.contains('h-m')) newLogout.classList.add('h-m');
		}
		this.#logout = newLogout;

		const newLogin = createButton(logIn(), false);
		newLogin.addEventListener('click', this.#loginHandler);
		if (this.contains(this.#login)) {
			this.#login.replaceWith(newLogin);
			if (this.#login.classList.contains('h-m')) newLogin.classList.add('h-m');
		}
		this.#login = newLogin;
	}

	render() {
		this.classList.add('box-border', 'w-screen', 'grid', 'header', 'grid-cols-5', 'gap-m', 'absolute', 'top-0', 'left-0', 'justify-between', 'z-1');
		this.#mainNav.classList.add('place-self-stretch');
	}

	get notif(): NotifBox {
		return this.#notif;
	}
}

if (!customElements.get('page-header')) {
	customElements.define('page-header', PageHeader, { extends: 'header' });
}
