import type { buttonData, InputMetadata, UserData } from '../../types-interfaces';
import { createInputGroup } from '../inputs/helpers';
import { usernamePattern } from '../../default-values';
import { createBtn } from './helpers';
import { createUserInline } from '../users/helpers';
import type { InputGroup } from '../inputs/fields';

/**
 * Custom HTML form element representing a search bar UI component.
 *
 * @remarks
 * The search bar uses configured input metadata and button data to build the form.
 * It manages rendering of search results dynamically below the input.
 * Responsively adjusts results container position on window resize and scroll events.
 */
export class Searchbar extends HTMLFormElement {
    #inputData: InputMetadata;
    #btn: buttonData;
    #results: HTMLDivElement;
    #searchInput: HTMLDivElement;

    constructor() {
        super();

        /**
         * Input field metadata for search input.
         * @type {InputMetadata}
         */
        this.#inputData = {
            labelContent: 'Search',
            type: 'text',
            id: 'search',
            pattern: usernamePattern,
            placeholder: 'Search a username...',
        };

        /**
         * Button metadata for the search submit button.
         * @type {buttonData}
         */
        this.#btn = {
            type: 'submit',
            content: 'Search',
            img: null,
            ariaLabel: 'Submit button for the search bar',
        };

        /**
         * Container for the search input field group.
         * @type {InputGroup}
         */
        this.#searchInput = createInputGroup(this.#inputData) as InputGroup;

        /**
         * Container div for showing search results.
         * @type {HTMLDivElement}
         */
        this.#results = document.createElement('div');

        // Bind context to event handler method
        this.setResultPos = this.setResultPos.bind(this);
    }

    /**
     * Called when the element is inserted into the DOM.
     * Triggers rendering and attaches window event listeners to update result position.
     */
    connectedCallback() {
        this.render();
        window.addEventListener('resize', this.setResultPos);
        window.addEventListener('scroll', this.setResultPos);
    }

    /**
     * Called when the element is removed from the DOM.
     * Detaches window event listeners to prevent memory leaks.
     */
    disconnectedCallback() {
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
    render() {
        this.role = 'search';
        this.id = 'searchbar';

        const img = this.createSearchIcon() as HTMLImageElement;
        const submit = createBtn(this.#btn) as HTMLButtonElement;

        this.action = '/';
        this.method = 'get';
        this.className =
            'items-center box-border grid grid-cols-[61%_37.8%] search-gap w-[100%] relative';
        this.#results.className =
            'hidden absolute brdr clear-bg min-h-fit max-h-[400px] pad-s overflow-y-auto box-border';

        this.#searchInput.appendChild(img);
        this.appendChild(this.#searchInput);
        this.appendChild(submit);
        this.appendChild(this.#results);

        this.setResultPos();
    }
}

if (!customElements.get('search-form')) {
    customElements.define('search-form', Searchbar, { extends: 'form' });
}
