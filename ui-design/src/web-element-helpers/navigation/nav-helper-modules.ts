import { menuBtn } from '../../web-elements/navigation/buttons';
import { tabWrapper } from '../../web-elements/navigation/tabs';

import type { Tab } from '../../web-elements/navigation/tabs.js';

/**
 * Creates a menu button element with specified text content.
 *
 * @param {string} content - Content of the button.
 * @returns {menuBtn} The created element.
 *
 * @example
 * const btn = createBtn("Click me");
 * document.body.appendChild(btn);
 */
export function createBtn(content: string): menuBtn {
    const btn = document.createElement('button', {
        is: 'menu-button',
    }) as menuBtn;
    btn.content = content;
    return btn;
}

export function createTabs(tabInfo: Array<Tab>): HTMLDivElement {
    const container = document.createElement('div', {
        is: 'tab-wrapper',
    }) as tabWrapper;
    container.tabList = tabInfo;
    return container;
}