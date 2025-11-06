import { createBtn } from './buttons-helpers.js';
import type { buttonData, MenuStyle, navigationLinksData } from '../types-interfaces.js';
import type { CustomButton } from './buttons.js';
import type { NavigationLinks } from './links.js';

/**
 * Custom HTML div element representing a menu with configurable style and elements.
 *
 * @remarks
 * The menu supports two styles: 'horizontal' and 'vertical', which control the grid layout direction.
 * It supports both icon and textual navigation elements, which can both be links or action buttons.
 * Menu elements are configured using {@link buttonData} and created via {@link createBtn}.
 */
export class Menu extends HTMLElement {
    #style: MenuStyle;
    #animated: boolean;
    #cache: Map<string, NavigationLinks | CustomButton>;
    #linkInfo: buttonData[] | navigationLinksData[];

    constructor() {
        super();
        this.#cache = new Map<string, NavigationLinks | CustomButton>();
        this.#linkInfo = [];
        this.#style = 'horizontal';
        this.#animated = false;
    }

    /**
     * Sets the menu's button elements.
     *
     * @param {buttonData[] | navigationLinksData[]} list - Array of objects containing the data for the menus items
     */
    set menuContent(list: buttonData[] | navigationLinksData[]) {
        this.#linkInfo = list;
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

    get menuStyle(): MenuStyle {
        return this.#style;
    }

    get animated(): boolean {
        return this.#animated;
    }

    get navInfo(): buttonData[] | navigationLinksData[] {
        return this.#linkInfo;
    }

    get cache(): Map<string, NavigationLinks | CustomButton> {
        return this.#cache;
    }

    /** Called when the element is inserted into the DOM; triggers rendering. */
    connectedCallback() {
        this.render();
    }

    /**
     * Renders the menu layout and appends button elements.
     *
     * @remarks
     * Uses CSS grid classes according to style and size settings.
     * Button elements are created using the {@link createBtn} helper with animation option.
     */
    render() {
        this.className = `w-full grid gap-r justify-items-center \
		auto-cols-fr auto-row-fr`;
        if (this.#style === 'horizontal') this.classList.add('grid-flow-col');
        if (this.#style === 'vertical') this.classList.add('grid-flow-rows');
    }
}
