import type { UserData, FormDetails } from '../types-interfaces.js';
import { BaseForm } from './baseform.js';
import { RemotePongSettings, LocalPongSettings } from './pong-settings.js';
import { Searchbar } from './search.js';
import { UserSettingsForm } from './user-settings.js';

/**
 * Merges with the existing HTMLElementTag map.
 *
 * Allows me to register custom elements to their classes so I can type elements dynamically and avoid code redundancy.
 * @interface HTMLElementTagMap
 */
interface HTMLElementTagMap {
    'default-form': BaseForm;
    'settings-form': UserSettingsForm;
    'search-form': Searchbar;
    'remote-pong-settings': RemotePongSettings;
    'local-pong-settings': LocalPongSettings;
}

/**
 * A generic function allowing me to create whichever form I'd like, typing it dynamically.
 *
 * @export
 * @template K - a key of `HTMLElementTagMap` - see {@link HTMLElementTagMap}
 * @param {K} tag - the litteral key of the element I want to create
 * @param {FormDetails} [form] - the fields of the desired form.
 * @param {UserData} [user] - an optional user parameter for `setting-form` that displays the user avatar.
 * @return {*}  {HTMLElementTagMap[K]}
 */
export function createForm<K extends keyof HTMLElementTagMap>(
    tag: K,
    form?: FormDetails,
    user?: UserData,
): HTMLElementTagMap[K] {
    if (tag === 'settings-form' && !user) {
        throw new Error('Missing user for user setting form.');
    } else {
        const el = document.createElement('form', { is: tag }) as HTMLElementTagMap[K];
        if (form) el.details = form;
        if (tag === 'settings-form') el.user = user;
        return el;
    }
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
