import type { buttonData, InputMetadata, UserData } from '../../types-interfaces';
import { createInputGrp } from '../inputs/helpers';
import { usernamePattern } from '../../default-values';
import { createBtn } from './helpers';
import { createUserInline } from '../users/helpers';
import type { inputGroup } from '../inputs/fields';

export class Searchbar extends HTMLFormElement {
    #inputData: InputMetadata;
    #btn: buttonData;
    #results: HTMLDivElement;
    searchInput: HTMLDivElement;

    constructor() {
        super();
        this.#inputData = {
            labelContent: 'Search',
            type: 'text',
            id: 'search',
            pattern: usernamePattern,
            placeholder: 'Search a username...',
        };
        this.#btn = {
            type: 'submit',
            content: 'Search',
            img: null,
            ariaLabel: 'Submit button for the search bar',
        };
        this.searchInput = createInputGrp(this.#inputData) as inputGroup;
        this.#results = document.createElement('div');

		// bind "this" to this actual instance of the class to avoid 'this' confusion in event listening.
        this.setResultPos = this.setResultPos.bind(this);
    }

    connectedCallback() {
        this.render();
        window.addEventListener('resize', this.setResultPos);
        window.addEventListener('scroll', this.setResultPos);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.setResultPos);
    }

    clearResults() {
        while (this.#results.firstChild) {
            this.#results.removeChild(this.#results.firstChild);
        }
    }

    addUser(user: UserData) {
        const el = createUserInline(user);
        this.#results.appendChild(el);
    }

    createSearchIcon(): HTMLImageElement {
        const img = document.createElement('img');
        img.className = 'w-s h-s absolute top-[6px] left-[6px]';
        img.src = '/assets/icons/search-icon.png';
        img.alt = 'A pixel art magnifier';
        return img;
    }

    displayResults(res: Array<UserData>) {
        this.clearResults();
        this.#results.classList.toggle('hidden');
        res.forEach((user) => this.addUser(user));
    }

    setResultPos() {
        const pos = this.searchInput.getBoundingClientRect();
		this.#results.style.top = `44px`;
		this.#results.style.width = `${pos.width}px`;
    }

    styleResultPanel() {
        this.#results.className = `hidden absolute brdr clear-bg min-h-fit max-h-[400px] pad-s overflow-y-auto box-border`;
    }

    render() {
        this.role = 'search';
        this.id = 'searchbar';

        const img = this.createSearchIcon() as HTMLImageElement;
        const submit = createBtn(this.#btn) as HTMLButtonElement;

        this.action = '/';
        this.method = 'get';
        this.className = 'items-center box-border grid grid-cols-[61%_37.8%] search-gap w-[100%] relative';

        console.log(this.searchInput);

        this.searchInput.appendChild(img);
        this.appendChild(this.searchInput);
        this.appendChild(submit);
        this.appendChild(this.#results);
        this.styleResultPanel();
        this.setResultPos();
    }
}

customElements.define('search-form', Searchbar, { extends: 'form' });
