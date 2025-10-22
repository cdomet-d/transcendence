import { CustomButton } from './buttons';
import { TabContainer } from './tabs';
import { DropdownMenu, Menu, SocialMenu } from './menus';
import { Searchbar } from './search';

import type {
    TabData,
    MenuStyle,
    buttonData,
    ProfileView,
    MenuSize,
    DropdownBg,
} from '../../types-interfaces';

/**
 * Creates a menu button element configured with provided button data.
 *
 * @param {buttonData} btn - Object containing button text, type, image, and aria-label.
 * @param {boolean} [animated] - Optional flag to enable text animation on the button.
 * @returns {HTMLButtonElement} The created {@link CustomButton} element.
 *
 * @example
 * const btnData = {
 *   type: "button",
 *   content: "Click me",
 *   img: null,
 *   ariaLabel: "Sample button"
 * };
 * const btn = createBtn(btnData, true);
 * document.body.appendChild(btn);
 */
export function createBtn(btn: buttonData, animated?: boolean): CustomButton {
    const el = document.createElement('button', { is: 'custom-button' }) as CustomButton;
    el.btn = btn;
    if (animated) el.animation = animated;
    return el;
}

/**
 * Creates a tab wrapper element containing an array of tabs.
 *
 * @param {Array<TabData>} list - Array of tab metadata objects to create tabs.
 * @returns {TabContainer} A {@link TabContainer} div element containing the tabs.
 *
 * @example
 * const tabsList = [
 *   { id: "home", content: "Home", default: true },
 *   { id: "profile", content: "Profile", default: false }
 * ];
 * const tabs = createTabs(tabsList);
 * document.body.appendChild(tabs);
 */
export function createTabs(list: Array<TabData>): TabContainer {
    const el = document.createElement('div', { is: 'tab-container' }) as TabContainer;
    el.tabList = list;
    return el;
}

/**
 * Creates a menu wrapper element with specified buttons, style, and optional size and animation.
 *
 * @param {buttonData[]} content - Array of button metadata objects for menu buttons.
 * @param {MenuStyle} style - Menu layout style, either 'vertical' or 'horizontal'.
 * @param {MenuSize} [size] - Optional menu size variant.
 * @param {boolean} [animated] - Optional flag to enable animation effects on menu buttons.
 * @returns {Menu} A configured {@link Menu} div element.
 *
 */
export function createMenu(
    content: buttonData[],
    style: MenuStyle,
    size?: MenuSize,
    animated?: boolean,
): Menu {
    const el = document.createElement('div', { is: 'menu-wrapper' }) as Menu;
    el.MenuElements = content;
    el.MenuStyle = style;
    if (size) el.MenuSize = size;
    if (animated) el.animation = animated;
    return el;
}

/**
 * Creates a social menu with button content and profile view context.
 *
 * @param {buttonData[]} content - Button metadata array for menu items.
 * @param {MenuStyle} style - Menu layout style, 'vertical' or 'horizontal'.
 * @param {ProfileView} v - Profile view state affecting menu display.
 * @returns {SocialMenu} A {@link SocialMenu} div element reflecting the profile view.
 *
 */
export function createSocialMenu(
    content: buttonData[],
    style: MenuStyle,
    v: ProfileView,
): SocialMenu {
    const el = document.createElement('div', { is: 'social-menu' }) as SocialMenu;
    el.MenuElements = content;
    el.MenuStyle = style;
    el.view = v;
    return el;
}

/**
 * Creates a social menu with button content and profile view context.
 *
 * @param {buttonData[]} options - Button metadata array for menu items.
 * @param {string} content - The toggle's text content.
 * @param {DropdownBg} style - Toggles dynamic background styling.
 * @returns {DropdownBg} A {@link DropdownMenu} set with the content of `options`.
 *
 */
export function createDropdown(
    options: buttonData[],
    content: string,
    style: DropdownBg,
): DropdownMenu {
    const el = document.createElement('div', { is: 'dropdown-menu' }) as DropdownMenu;
    el.setOptions = options;
    el.setToggleContent = content;
    el.setDropdownStyling = style;
    return el;
}

/**
 * Creates an empty search bar element.
 *
 * @returns {Searchbar} A new {@link Searchbar} form element.
 *
 * @example
 * const searchbar = createSearchbar();
 * document.body.appendChild(searchbar);
 */
export function createSearchbar(): Searchbar {
    const el = document.createElement('form', { is: 'search-form' }) as Searchbar;
    return el;
}

/**
 * Asynchronously retrieves the search bar element by its ID.
 *
 * Waits up to 1000 milliseconds for an element with ID 'searchbar' to appear in the DOM.
 * Checks repeatedly every 100 milliseconds until found or timeout elapses.
 *
 * @returns {Promise<Searchbar | null>} A promise that resolves with the {@link Searchbar} element if found, or `null` if not found within the timeout.
 */
export function getSearchbarAsync(): Promise<Searchbar | null> {
    const timeout: number = 1000;
    const start = Date.now();
    return new Promise((resolve) => {
        function resolveSearchbar() {
            const s = document.getElementById('searchbar') as Searchbar | null;
            if (s) {
                resolve(s);
            } else {
                if (Date.now() - start >= timeout) resolve(null);
                else setTimeout(resolveSearchbar, 100);
            }
        }
        resolveSearchbar();
    });
}
