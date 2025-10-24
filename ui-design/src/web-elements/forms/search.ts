import { BaseForm } from './baseform';
import { createInputGroup } from '../inputs/helpers';
import { createUserInline } from '../users/profile-helpers';
import { InputGroup } from '../inputs/fields';

import type { UserData } from '../../types-interfaces';

/**
 * Custom HTML form element representing a search bar UI component.
 *
 * @remarks
 * The search bar uses configured input metadata and button data to build the form.
 * It manages rendering of search results dynamically below the input.
 * Responsively adjusts results container position on window resize and scroll events.
 */
export class Searchbar extends BaseForm {
    #searchInput!: InputGroup;
    #results: HTMLDivElement;

    constructor() {
        super();
        this.#results = document.createElement('div');
        this.setResultPos = this.setResultPos.bind(this);
    }

    override connectedCallback() {
        super.connectedCallback();
        window.addEventListener('resize', this.setResultPos);
        window.addEventListener('scroll', this.setResultPos);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('resize', this.setResultPos);
        window.removeEventListener('scroll', this.setResultPos);
    }

    /**
     * Clears all displayed search results from the results container.
     */
    clearResults() {
        while (this.#results.firstChild) {
            this.#results.removeChild(this.#results.firstChild);
        }
    }

    /**
     * Adds a user element representing a single user to the search results container.
     *
     * @param {UserData} user - User data to render inline.
     */
    addUser(user: UserData) {
        const el = createUserInline(user);
        this.#results.appendChild(el);
    }

    /**
     * Creates and returns an image element used as the search icon within the input field.
     *
     * @returns {HTMLImageElement} The search icon image element.
     */
    createSearchIcon(): HTMLImageElement {
        const img = document.createElement('img');
        img.className = 'w-s h-s absolute top-[6px] left-[6px]';
        img.src = '/assets/icons/search-icon.png';
        img.alt = 'A pixel art magnifier';
        return img;
    }

    /**
     * Displays a list of user search results.
     * Clears existing results and toggles results container visibility.
     *
     * @param {Array<UserData>} res - Array of user data to display as search results.
     */
    displayResults(res: Array<UserData>) {
        this.clearResults();
        this.#results.classList.toggle('hidden');
        res.forEach((user) => this.addUser(user));
    }

    /**
     * Recalculates and sets the position and width of the results container
     * relative to the search input element.
     */
    setResultPos() {
        const pos = this.#searchInput.getBoundingClientRect();
        this.#results.style.top = `44px`;
        this.#results.style.width = `${pos.width}px`;
    }

    /**
     * Renders the search bar structure including input, submit button, search icon, and results container.
     * Sets form attributes and class names appropriately.
     */
    override render() {
        const img = this.createSearchIcon() as HTMLImageElement;
        this.#searchInput = createInputGroup(super.details.fields[0]);

        this.#searchInput.appendChild(img);
        this.appendChild(this.#searchInput);
        super.renderButtons();
        this.appendChild(this.#results);

        this.classList.add('sidebar-right', 'search-gap', 'relative');
        this.#results.className =
            'hidden absolute brdr bg min-h-fit max-h-l pad-s overflow-y-auto box-border';
        this.setResultPos();
    }
}

if (!customElements.get('search-form')) {
    customElements.define('search-form', Searchbar, { extends: 'form' });
}
