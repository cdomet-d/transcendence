import { TabContainer } from './tabs';
import { MatchHistory } from '../stats/matches';
import { UserMasonery } from '../users/user-profile-containers';
import type { MatchOutcome, TabData, UserData } from '../types-interfaces';

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
 * Creates a match history element and populates it with match data.
 *
 * @param {MatchOutcome[]} matches - Array of match outcome objects.
 * @returns {MatchHistory} A {@link MatchHistory} div element containing the match history.
 */
export function createMatchHistory(matches: MatchOutcome[]): MatchHistory {
    const el = document.createElement('div', { is: 'match-history' }) as MatchHistory;
    el.setHistory(matches);
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
