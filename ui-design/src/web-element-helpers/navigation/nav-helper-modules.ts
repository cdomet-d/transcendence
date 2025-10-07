import { menuBtn } from '../../web-elements/navigation/buttons';
import { tabWrapper } from '../../web-elements/navigation/tabs';

import type { Tab } from '../../web-elements/navigation/tabs.js';
import { Menu, type Button, type MenuStyle } from '../../web-elements/navigation/menus.js';


/**
 * Creates a menu button element.
 *
 * @param btn - Object with button content and role.
 * @returns The created {@link menuBtn} element.
 *
 * @example
 * const btn = createBtn({ content: "Click me", role: "menuitem" });
 * document.body.appendChild(btn);
 */
export function createBtn(btn: Button): menuBtn {
    const el = document.createElement('button', {
        is: 'menu-button',
    }) as menuBtn;
    el.content = btn.content;
    el.role = btn.role;
    return el;
}

/**
 * Creates a tab wrapper element with a list of tabs.
 *
 * @param list - Array of {@link Tab} objects.
 * @returns A {@link tabWrapper} div element containing the tabs.
 */
export function createTabs(list: Array<Tab>): HTMLDivElement {
    const el = document.createElement('div', {
        is: 'tab-wrapper',
    }) as tabWrapper;
    el.tabList = list;
    return el;
}


/**
 * Creates a menu wrapper element with buttons and style.
 *
 * @param content - Array of {@link Button} objects to include in the menu.
 * @param style - Menu style of type {@link MenuStyle}. Can be vertical or horizontal. Defaults to horizontal.
 * @returns A styled {@link Menu} div element.
 */
export function createMenu(content: Array<Button>, style: MenuStyle): HTMLDivElement {
    const el = document.createElement('div', { is: 'menu-wrapper' }) as Menu;
	el.MenuElements = content;
	el.MenuStyle = style;
	return el;
}
