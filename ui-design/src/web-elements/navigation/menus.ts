import { createBtn } from './helpers';
import type { BtnMetadata, MenuStyle, ProfileView } from '../../types-interfaces';
import type { Icon } from '../typography/images';

/**
 * Custom HTML div element representing a menu with configurable style and elements.
 *
 * @remarks
 * The menu supports two styles: 'horizontal' and 'vertical', which control the grid layout direction.
 * They also support both icons and textual elements.
 * Menu elements are buttons represented by BtnMetadata and generated using the createBtn helper.
 *
 * @example
 * ```
 * const menu = document.createElement('div', { is: 'menu-wrapper' }) as Menu;
 * menu.MenuStyle = 'vertical';
 * menu.MenuElements = [
 *   { role: 'button', content: 'Home', img: null, ariaLabel: 'Go to home' },
 *   { role: 'button', content: 'Profile', img: null, ariaLabel: 'Go to profile' }
 * ];
 * document.body.appendChild(menu);
 * ```
 */
export class Menu extends HTMLDivElement {
    #elements: Array<BtnMetadata>;
    #style: MenuStyle;

    constructor() {
        super();
        this.#elements = [];
        this.#style = 'horizontal';
    }
    /**
     * Sets the menu's button elements.
     * @param list - Array of BtnMetadata for menu buttons.
     */
    set MenuElements(list: Array<BtnMetadata>) {
        this.#elements = list;
    }

    /**
     * Sets the menu's layout style.
     * @param style - MenuStyle ('horizontal' or 'vertical').
     */	
    set MenuStyle(style: MenuStyle) {
        this.#style = style;
    }

    connectedCallback() {
        this.render();
    }

	/**
     * Renders the menu layout and appends button elements.
     */
    render() {
		this.id = 'menu';
        this.className = 'gap-s box-border grid justify-items-center auto-cols-fr auto-rows-fr';
        if (this.#style === 'horizontal') this.classList.add('grid-flow-col');
        if (this.#style === 'vertical') this.classList.add('grid-flow-rows');
        this.#elements.forEach((item) => this.appendChild(createBtn(item)));
    }
}

customElements.define('menu-wrapper', Menu, { extends: 'div' });

//TODO: update SocialMenu to Setting button when view is 'self'
//TODO: is the UI update as smooth as it could be ?

/**
 * Represents a social menu with dynamic view state for user relationships.
 *
 * @remarks
 * The menu updates its appearance based on the profile view ('friend', 'stranger', 'self').
 */
export class SocialMenu extends Menu {
    #view: ProfileView;
    constructor() {
        super();
        this.#view = 'stranger';
    }

    /**
     * Sets the profile view and updates menu appearance.
     * @param v - ProfileView type.
     */
    set view(v: ProfileView) {
        this.#view = v;
		this.updateView();
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.updateView();
    }

    /**
     * Updates menu for 'friend' view, changing icon.
     * @param icon - Icon element to update.
     */
    friend(icon: Icon) {
        this.classList.remove('hidden');
        icon.src = '/assets/icons/remove-user.png';
    }

    /**
     * Updates menu for 'stranger' view, changing icon.
     * @param icon - Icon element to update.
     */
    stranger(icon: Icon) {
        this.classList.remove('hidden');
        icon.src = '/assets/icons/add-user.png';
    }

    /**
     * Updates menu for 'self' view, hiding the menu.
     */
    self() {
        this.classList.add('hidden');
    }

    /**
     * Updates the menu appearance based on current view state.
     */
    updateView() {
		this.id = 'social-menu';
        const icon = this.querySelector('#friendship') as Icon;
        if (!icon) return;
        if (this.#view === 'friend') this.friend(icon);
        else if (this.#view === 'stranger') this.stranger(icon);
        else if (this.#view === 'self') this.self();
    }
}

customElements.define('social-menu', SocialMenu, { extends: 'div' });
