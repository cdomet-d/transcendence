import { TabContainer } from './tabs';
import { MatchHistory } from '../stats/matches';
import { UserMasonery } from '../users/user-profile-containers';
import type { MatchOutcome, TabData, UserData } from '../../types-interfaces';

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

export function createMatchHistory(matches: MatchOutcome[]): MatchHistory {
    const el = document.createElement('div', { is: 'match-history' }) as MatchHistory;
    el.setHistory(matches);
    return el;
}

export function createUserMasonery(users: UserData[]): UserMasonery {
    const el = document.createElement('div', { is: 'user-masonery' }) as UserMasonery;
    el.setUsers(users);
    return el;
}
