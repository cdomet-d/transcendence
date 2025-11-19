import { BaseForm } from './baseform.js';
import { createInputGroup } from '../inputs/helpers.js';
import { createUserInline } from '../users/profile-helpers.js';
import { InputGroup } from '../inputs/fields.js';
import { NoResults } from '../typography/images.js';

import type { UserData } from '../types-interfaces.js';
import { search } from './default-forms.js';

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
    #results: HTMLDivElement;

    constructor() {
        super();
        super.details = search;
        this.#results = document.createElement('div');
        // this.submitHandler = this.submitHandlerImplementation.bind(this);
        this.setResultPos = this.setResultPos.bind(this);
        this.#searchInput = document.createElement('div', { is: 'input-and-label' }) as InputGroup;
    }

    #createQueryURL(form: FormData) {
        const target = form.get('searchbar');
        if (target) super.details.action += target;
        console.log(super.details.action);
    }

    // TODO: maybe we can just attempt to get the user ?
    override async submitHandlerImplementation(ev: SubmitEvent) {
        ev.preventDefault();
        const form = new FormData(this);
        this.#createQueryURL(form);
        this.initReq;
        try {
            const response = await this.sendForm(super.details.action, this.initReq());
            const searchResults = await response.json();
            this.displayResults(searchResults as UserData[]);
        } catch (error) {
            console.error(error);
        }
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
        this.#results.append(el);
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

    /**
     * Displays a list of user search results.
     * Clears existing results and toggles results container visibility.
     *
     * @param {UserData[]} res - Array of user data to display as search results.
     */
    displayResults(res: UserData[]) {
        this.clearResults();
        this.#results.classList.toggle('hidden');
        if (res.length < 1)
            this.#results.append(document.createElement('div', { is: 'no-results' }) as NoResults);

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
        if (super.details.fields[0]) this.#searchInput = createInputGroup(super.details.fields[0]);

        this.#searchInput.append(img);
        this.append(this.#searchInput);
        super.renderButtons();
        this.append(this.#results);

        this.classList.add('sidebar-right', 'search-gap', 'relative');
        this.#results.className =
            'hidden absolute brdr bg min-h-fit max-h-l pad-xs overflow-y-auto box-border';
        this.setResultPos();
    }
}

if (!customElements.get('search-form')) {
    customElements.define('search-form', Searchbar, { extends: 'form' });
}
