import { TabContainer } from './tabs';
import type { TabData } from '../../types-interfaces';

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
export function createTabs(list: TabData[]): TabContainer {
    const el = document.createElement('div', { is: 'tab-container' }) as TabContainer;
    el.tabList = list;
    return el;
}
