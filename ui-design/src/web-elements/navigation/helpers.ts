import { menuBtn } from './buttons';
import { tabWrapper } from './tabs';
import { Menu, SocialMenu } from './menus';
import { Searchbar } from './search';

import type { TabMetadata, MenuStyle, buttonData, ProfileView, MenuSize } from '../../types-interfaces';

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
export function createBtn(btn: buttonData, animated?: boolean): HTMLButtonElement {
    const el = document.createElement('button', { is: 'menu-button' }) as menuBtn;
    el.btn = btn;
	if (animated) el.animation = animated;
    return el;
}

/**
 * Creates a tab wrapper element with a list of tabs.
 *
 * @param list - Array of {@link TabMetadata} objects.
 * @returns A {@link tabWrapper} div element containing the tabs.
 */
export function createTabs(list: Array<TabMetadata>): tabWrapper {
    const el = document.createElement('div', { is: 'tab-wrapper' }) as tabWrapper;
    el.tabList = list;
    return el;
}

/**
 * Creates a menu wrapper element with buttons and style.
 *
 * @param content - Array of {@link buttonData} objects to include in the menu.
 * @param style - Menu style of type {@link MenuStyle}. Can be vertical or horizontal. Defaults to horizontal.
 * @returns A styled {@link Menu} div element.
 */
export function createMenu(content: Array<buttonData>, style: MenuStyle, size?: MenuSize, animated?: boolean): Menu {
    const el = document.createElement('div', { is: 'menu-wrapper' }) as Menu;
    el.MenuElements = content;
    el.MenuStyle = style;
	if (size) el.MenuSize = size;
	if (animated) el.animation = animated;
    return el;
}

export function createSocialMenu(
    content: Array<buttonData>,
    style: MenuStyle,
    v: ProfileView,
): SocialMenu {
    const el = document.createElement('div', { is: 'social-menu' }) as SocialMenu;
    el.MenuElements = content;
    el.MenuStyle = style;
    el.view = v;
    return el;
}


export function createSearchbar(): Searchbar {
    const el = document.createElement('form', { is: 'search-form' }) as Searchbar;
    return el;
}

export function getSearchbarAsync(timeout: number = 1000): Promise<Searchbar | null> {
    const start = Date.now();
    return new Promise((resolve) => {
        function resolveSearchbar() {
            const s = document.getElementById('searchbar') as Searchbar | null;
            if (s) {
                resolve(s);
            } else {
                if (Date.now() - start >= timeout) resolve(null);
                setTimeout(resolveSearchbar, 100);
            }
        }
        resolveSearchbar();
    });
}
