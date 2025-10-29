import type { UserData, formDetails } from '../../types-interfaces';
import { BaseForm } from './baseform';
import { RemotePongSettings, LocalPongSettings } from './pong-settings';
import { Searchbar } from './search';
import { UserSettingsForm } from './user-settings';

interface HTMLElementTagMap {
    'default-form': BaseForm;
    'settings-form': UserSettingsForm;
    'search-form': Searchbar;
    'remote-pong-settings': RemotePongSettings;
    'local-pong-settings': LocalPongSettings;
}

export function createForm<K extends keyof HTMLElementTagMap>(
    tag: K,
    form: formDetails,
    user?: UserData,
): HTMLElementTagMap[K] {
    console.log(tag);
    const el = document.createElement('form', { is: tag }) as HTMLElementTagMap[K];
    el.details = form;
    if (tag === 'settings-form') el.user = user;
    return el;
}

/**
 * Creates a search bar element.
 *
 * @returns {Searchbar} A new {@link Searchbar} form element.
 *
 * @example
 * const searchbar = createSearchbar();
 * document.body.appendChild(searchbar);
 */
export function createSearchbar(details: formDetails): Searchbar {
    const el = document.createElement('form', { is: 'search-form' }) as Searchbar;
    el.details = details;
    return el;
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
