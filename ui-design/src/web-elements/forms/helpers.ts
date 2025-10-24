import { AccountCreationForm } from './account-create-form';
import { Searchbar } from './search';
import { UserSettingsForm } from './user-settings';

import type { UserData, formDetails } from '../../types-interfaces';

export function createUserSettingsForm(user: UserData, form: formDetails): UserSettingsForm {
    const el = document.createElement('form', { is: 'settings-form' }) as UserSettingsForm;
    el.user = user;
    el.details = form;
    return el;
}

export function createRegistrationForm(form: formDetails): AccountCreationForm {
    const el = document.createElement('form', {
        is: 'account-creation-form',
    }) as AccountCreationForm;
    el.details = form;
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
