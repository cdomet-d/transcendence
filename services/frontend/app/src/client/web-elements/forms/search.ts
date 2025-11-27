import { BaseForm } from './baseform.js';
import { createErrorFeedback } from '../event-elements/error.js';
import { createInputGroup } from '../inputs/helpers.js';
import { createUserInline } from '../users/profile-helpers.js';
import { InputGroup } from '../inputs/fields.js';
import { NoResults } from '../typography/images.js';
import { search } from './default-forms.js';
import { UserInline } from '../users/profile.js';
import type { UserData } from '../types-interfaces.js';
import { userArrayFromAPIRes } from '../../api-responses/user-responses.js';

/**
 * Custom HTML form element representing a search bar UI component.
 *
 * @remarks
 * The search bar uses configured input metadata and button data to build the form.
 * It manages rendering of search results dynamically below the input.
 * Responsively adjusts results container position on window resize and scroll events.
 */
export class Searchbar extends BaseForm {
    #searchInput: InputGroup;
    #results: HTMLUListElement;
    #currentFocus: number;

    #navHandler: (ev: KeyboardEvent) => void;
    #blurHandler: (ev: FocusEvent) => void;

    /* -------------------------------------------------------------------------- */
    /*                                   Default                                  */
    /* -------------------------------------------------------------------------- */
    constructor() {
        super();
        super.details = search;
        this.#results = document.createElement('ul');
        this.#searchInput = document.createElement('div', { is: 'input-and-label' }) as InputGroup;
        this.#currentFocus = -1;

        this.submitHandler = this.submitHandlerImplementation.bind(this);
        this.#navHandler = this.#navigationImplementation.bind(this);
        this.#blurHandler = this.#focusOutImplementation.bind(this);
    }

    override connectedCallback() {
        super.connectedCallback();
        this.addEventListener('keydown', this.#navHandler);
        this.addEventListener('focusout', this.#blurHandler);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('keydown', this.#navHandler);
        this.removeEventListener('focusout', this.#blurHandler);
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Rendering                                 */
    /* -------------------------------------------------------------------------- */

    /**
     * Renders the search bar structure including input, submit button, search icon, and results container.
     * Sets form attributes and class names appropriately.
     */
    override render() {
        const img = this.createSearchIcon() as HTMLImageElement;
        if (super.details.fields[0]) this.#searchInput = createInputGroup(super.details.fields[0]);

        this.#searchInput.append(img);
        this.append(this.#searchInput);
        super.renderButtons();
        this.append(this.#results);

        this.classList.add('sidebar-right', 'search-gap');
        this.#results.className =
            'hidden absolute top-[64px] brdr bg min-h-fit w-full overflow-y-auto box-border';
    }

    /**
     * Creates and returns an image element used as the search icon within the input field.
     *
     * @returns {HTMLImageElement} The search icon image element.
     */
    createSearchIcon(): HTMLImageElement {
        const img = document.createElement('img');
        img.className = 'w-s h-s absolute top-[6px] left-[6px]';
        img.src = '/public/assets/images/search-icon.png';
        img.alt = 'A pixel art magnifier';
        return img;
    }

    /* -------------------------------------------------------------------------- */
    /*                               Event listeners                              */
    /* -------------------------------------------------------------------------- */

    override async fetchAndRedirect(url: string, req: RequestInit): Promise<void> {
        const response = await fetch(url, req);
        const data = await response.json();

        this.displayResults(userArrayFromAPIRes(data));
    }

    #createQueryURL(form: FormData): string | undefined {
        const target = form.get('searchbar');
        if (!target) return undefined;
        let url = super.details.action;
        url += target;
        return url;
    }

    override async submitHandlerImplementation(ev: SubmitEvent) {
        ev.preventDefault();
        const form = new FormData(this);
        const url = this.#createQueryURL(form);
        if (!url) {
            createErrorFeedback('Error processing query - try again');
            return;
        }
        try {
            await this.fetchAndRedirect(url, this.initReq());
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Used by the `'keydown'` handler to calculate where the user is in the menu's option, remaining within the bounds of the options.
     * @param {number} delta - the incrementing step; it's worth `-1` on `ArrowUp` and `1` on `ArrowDown`
     */
    #moveFocus(delta: number) {
        this.#currentFocus =
            (this.#currentFocus + delta + this.#results.children.length) %
            this.#results.children.length;
        const focusedOption = this.#results.children[this.#currentFocus];
        if (focusedOption && focusedOption instanceof UserInline) {
            focusedOption.getUsername.link.focus();
        }
    }

    #navigationImplementation(ev: KeyboardEvent) {
        const actions: { [key: string]: () => void } = {
            ArrowDown: () => this.#moveFocus(1),
            ArrowUp: () => this.#moveFocus(-1),
            Escape: () => this.#hideResults(),
        };

        if (actions[ev.key]) {
            ev.preventDefault();
            actions[ev.key]!();
        }
    }
    /* -------------------------------------------------------------------------- */
    /*                              Result Rendering                              */
    /* -------------------------------------------------------------------------- */
    /**
     * Clears all displayed search results from the results container.
     */
    clearResults() {
        while (this.#results.firstChild) {
            this.#results.removeChild(this.#results.firstChild);
        }
    }

    #focusOutImplementation(ev?: FocusEvent) {
        if (!ev) {
            this.#hideResults();
        } else {
            const newFocus = ev.relatedTarget as HTMLElement | null;
            if (!newFocus || !this.contains(newFocus)) {
                this.#hideResults();
            }
        }
    }

    #hideResults() {
        this.clearResults();
        this.#results.classList.add('hidden');
        this.#results.setAttribute('hidden', '');
    }

    /**
     * @param {UserData} user - User data to render inline.
     */
    addUser(user: UserData) {
        const el = createUserInline(user);
        this.#results.append(el);
    }

    /**
     * Displays a list of user search results.
     * Clears existing results and toggles results container visibility.
     *
     * @param {UserData[]} res - Array of user data to display as search results.
     */
    displayResults(res: UserData[]) {
        this.clearResults();
        this.#results.classList.remove('hidden');
        this.#results.removeAttribute('hidden');
        if (res.length < 1)
            this.#results.append(document.createElement('div', { is: 'no-results' }) as NoResults);
        res.forEach((user) => this.addUser(user));
    }
}

if (!customElements.get('search-form')) {
    customElements.define('search-form', Searchbar, { extends: 'form' });
}
