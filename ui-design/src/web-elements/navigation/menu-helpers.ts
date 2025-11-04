import type {
    MenuStyle,
    MenuSize,
    ProfileView,
    DropdownBg,
    buttonData,
} from '../types-interfaces.js';

import { Menu, SocialMenu, DropdownMenu } from './menus.js';

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
    const el = document.createElement('nav', { is: 'nav-menu-wrapper' }) as Menu;
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
    const el = document.createElement('nav', { is: 'social-menu' }) as SocialMenu;
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
