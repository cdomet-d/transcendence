import { TabContainer } from './tabs.js';
import { UserMasonery } from '../users/user-profile-containers.js';
import type { TabData, UserData } from '../types-interfaces.js';

/**
 * Creates a tab wrapper element containing an array of tabs.
 *
 * @param {TabData[]} list - Array of tab metadata objects to create tabs.
 * @returns {TabContainer} A {@link TabContainer} div element containing the tabs.
 *
 */
export function createTabs(list: TabData[]): TabContainer {
    const el = document.createElement('div', { is: 'tab-container' }) as TabContainer;
    el.tabList = list;
    return el;
}

/**
 * Creates a user masonry element and populates it with user data.
 *
 * @param {UserData[]} users - Array of user data objects.
 * @returns {UserMasonery} A {@link UserMasonery} div element containing the user masonry.
 */
export function createUserMasonery(users: UserData[]): UserMasonery {
    const el = document.createElement('div', { is: 'user-masonery' }) as UserMasonery;
    el.setUsers(users);
    return el;
}
