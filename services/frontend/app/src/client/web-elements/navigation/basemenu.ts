import { createButton, createLink } from './buttons-helpers.js';
import type { ButtonData, MenuData, MenuStyle } from '../types-interfaces.js';
import type { CustomButton } from './buttons.js';
import type { NavigationLinks } from './links.js';

/**
 * Custom HTML div element representing a menu with configurable style and elements.
 *
 * @remarks
 * The menu supports two styles: 'horizontal' and 'vertical', which control the grid layout direction.
 * It supports both icon and textual navigation elements, which can both be links or action buttons.
 * Menu elements are configured using {@link ButtonData} and created via {@link createButton}.
 */
export class Menu extends HTMLElement {
	/* ------------------------------- attributes ------------------------------- */
	#style: MenuStyle;
	#animated: boolean;
	#cache: Map<string, NavigationLinks | CustomButton>;
	#linkInfo: MenuData | null;
	#menuLinks: HTMLUListElement;
	/* -------------------------------------------------------------------------- */

	constructor() {
		super();
		this.#cache = new Map<string, NavigationLinks | CustomButton>();
		this.#linkInfo = null;
		this.#style = 'horizontal';
		this.#animated = false;
		this.#menuLinks = document.createElement('ul');
		this.append(this.#menuLinks);
	}

	/** Called when the element is inserted into the DOM; triggers rendering. */
	connectedCallback() {
		this.render();
	}

	/* ---------------------------- setters & getters --------------------------- */
	/**
	 * Sets the menu's button elements.
	 *
	 * @param {ButtonData[] | NavigationLinksData[]} list - Array of objects
	 * containing the data for the menus items
	 */
	set menuContent(list: MenuData) {
		this.#linkInfo = list;
		if (list.id) this.id = list.id;
	}

	/**
	 * Sets the menu's layout style.
	 *
	 * @param {MenuStyle} style - menuStyle, either 'horizontal' or 'vertical'.
	 */
	set menuStyle(style: MenuStyle) {
		this.#style = style;
	}

	/**
	 * Enables or disables animation for menu buttons.
	 *
	 * @param {boolean} isAnimated - True to enable animations, false otherwise.
	 */
	set animation(isAnimated: boolean) {
		this.#animated = isAnimated;
	}

	get listbox() {
		return this.#menuLinks;
	}

	get menuStyle(): MenuStyle {
		return this.#style;
	}

	get animated(): boolean {
		return this.#animated;
	}

	get navInfo(): MenuData | null {
		return this.#linkInfo;
	}

	get cache(): Map<string, NavigationLinks | CustomButton> {
		return this.#cache;
	}

	/* --------------------------------- render --------------------------------- */
	renderBtns() {
		if (!this.#linkInfo || !this.#linkInfo.buttons) throw new Error('Undefined data');
		this.#linkInfo.buttons.forEach((button) => {
			const el = createButton(button, this.#animated);
			el.role = 'menuitem';
			el.id = button.id;
			el.setAttribute('aria-label', button.id);
			this.#menuLinks.append(el);
			this.#cache.set(el.id, el);
		});
	}

	renderLinks() {
		if (!this.#linkInfo || !this.#linkInfo.links) throw new Error('Undefined data');
		this.#linkInfo.links.forEach((link) => {
			const el = createLink(link, this.#animated);
			el.role = 'menuitem';
			el.setAttribute('aria-label', link.id);
			this.#menuLinks.append(el);
			this.#cache.set(el.id, el);
		});
	}

	/**
	 * Renders the menu layout and appends button elements.
	 *
	 * @remarks
	 * Uses CSS grid classes according to style and size settings.
	 * Button elements are created using the {@link createButton} helper with animation option.
	 */
	render() {
		this.className = 'w-full';
		this.#menuLinks.className = `w-full grid gap-r justify-items-center \
		auto-cols-fr auto-row-fr`;
		if (this.#style === 'horizontal') this.#menuLinks.classList.add('grid-flow-col');
		if (this.#style === 'vertical') this.#menuLinks.classList.add('grid-flow-rows');
		if (this.#linkInfo && this.#linkInfo.buttons) this.renderBtns();
		if (this.#linkInfo && this.#linkInfo.links) this.renderLinks();
	}
}

if (!customElements.get('base-menu')) {
	customElements.define('base-menu', Menu, { extends: 'nav' });
}
