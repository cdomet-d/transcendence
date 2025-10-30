import { createDropdown, createMenu } from './menu-helpers';
import { createForm } from '../forms/helpers';
import { createIcon } from '../typography/helpers';
import { createNotificationBox } from '../users/notifications-helpers';
import { DropdownMenu, Menu } from './menus';
import { Icon } from '../typography/images';
import { iMeta, languageMenu, mainMenu } from '../../default-values';
import { NotifBox } from '../users/notifications';
import { Searchbar } from '../forms/search';

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

// .header {
//   box-sizing: border-box;
//   width: 100%;
//   height: var(--ml);
//   display: grid;
//   grid-template-columns: 5% 32.3% 48.87% 5% 5%;
//   grid-template-rows: var(--ml);
//   place-items: center;
//   gap: var(--s);
// }

// <div class="header">
// 	<img class="header-item image-m" src="../assets/icons/default-avatar.png" />
// 	<div class="header-item input-with-button">
// 		<div class="search input-n-label">
// 			<img class="w-s h-s absolute top-[4px] left-[4px]" src="../assets/icons/search-icon.png"></img>
// 			<label class="thin-border" for="search"> search </label>
// 			<input class="input-bg contrast-brdr" id="search" placeholder="search a user..."
// 				type="text"></input>
// 		</div>
// 		<button class="contrast-brdr button-bg" type="button"> search </button>
// 	</div>
// 	<div class="header-item horizontal-menu-wrapper">
// 		<button class="button-bg contrast-brdr menu-element"> profile </button>
// 		<button class="button-bg contrast-brdr menu-element"> leaderboard </button>
// 		<button class="button-bg contrast-brdr menu-element"> play </button>
// 	</div>
// 	<div class="header-item notification-wrapper">
// 		<div id="notifPopup" class="notification-interactive">
// 			<div class="notification-content bg brdr">
// 				<img src="../assets/icons/notification-bubble.png" />
// 				<p> %login% challenged you to a 1v1 match !! </p>
// 				<p> %login% challenged you to a tournament !! </p>
// 				<p> %login% challenged you to a 1v1 match !! </p>
// 				<p> %login% challenged you to a 1v1 match !! </p>
// 				<p> %login% challenged you to a 1v1 match !! </p>
// 			</div>
// 		</div>
// 		<div id="notifToggle" class="notification-icon-container">
// 			<div id="notifAlert" selected class="brdr-red unread-notification"> </div>
// 			<img class="image-m" src="../assets/icons/notification.png" />
// 		</div>
// 	</div>
// 	<div class="dropdown">
// 		<button id="language-switch" class="language button-bg contrast-brdr">
// 			${currentLang}
// 		</button>
// 		<div id="language-options" class="language-options plain-clear-bg contrast-brdr">
// 			<div class="dropdown-item" data-lang="en">English</div>
// 			<div class="dropdown-item" data-lang="fr">Français</div>
// 			<div class="dropdown-item" data-lang="es">Español</div>
// 		</div>
// 	</div>
// </div>
