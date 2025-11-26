import type {
    MenuStyle,
    DropdownBg,
    ButtonData,
    MenuData,
} from '../types-interfaces.js';

import { SocialMenu, DropdownMenu } from './menus.js';
import { Menu } from './basemenu.js';

/**
 * Creates a social menu with button content and profile view context.
 *
 * @param {ButtonData[]} content - Button metadata array for menu items.
 * @param {MenuStyle} style - Menu layout style, 'vertical' or 'horizontal'.
 * @param {ProfileView} v - Profile view state affecting menu display.
 * @returns {SocialMenu} A {@link SocialMenu} div element reflecting the profile view.
 *
 */
export function createSocialMenu(content: MenuData, style: MenuStyle): SocialMenu {
    const el = document.createElement('nav', { is: 'social-menu' }) as SocialMenu;
    el.menuContent = content;
    el.menuStyle = style;
    // el.view = v;
    return el;
}

export function createMenu(content: MenuData, style: MenuStyle, animated?: boolean): Menu {
    const el = document.createElement('nav', { is: 'base-menu' }) as Menu;
    el.menuContent = content;
    el.menuStyle = style;
	console.log(content, animated);
    if (animated) el.animation = animated;
    return el;
}

/**
 * Creates a social menu with button content and profile view context.
 *
 * @param {ButtonData[]} options - Button metadata array for menu items.
 * @param {string} content - The toggle's text content.
 * @param {DropdownBg} style - Toggles dynamic background styling.
 * @returns {DropdownBg} A {@link DropdownMenu} set with the content of `options`.
 *
 */
export function createDropdown(
    options: ButtonData[],
    content: string,
    style: DropdownBg,
): DropdownMenu {
    const el = document.createElement('div', { is: 'dropdown-menu' }) as DropdownMenu;
    el.setOptions = options;
    el.setToggleContent = content;
    el.setDropdownStyling = style;
    return el;
}
