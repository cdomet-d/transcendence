import type { buttonData, InputMetadata, UserData } from '../../types-interfaces';
import { createInputGrp } from '../inputs/helpers';
import { usernamePattern } from '../../default-values';
import { createBtn } from './helpers';
import { createUserInline } from '../users/helpers';

export class Searchbar extends HTMLFormElement {
    #input: InputMetadata;
    #btn: buttonData;
    #results: HTMLDivElement;

    constructor() {
        super();
        this.#input = {
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
        this.#results = document.createElement('div');
    }

    connectedCallback() {
        this.render();
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

    styleResultPanel() {
        this.#results.className =
            'hidden brdr clear-bg min-h-fit max-h[5rem] pad-s overflow-y-auto';
    }

    render() {
        this.role = 'search';
        this.id = 'searchbar';

        const img = this.createSearchIcon();
        const input = createInputGrp(this.#input);
        const submit = createBtn(this.#btn);

        this.action = '/';
        this.method = 'get';
        this.className = 'items-center box-border grid grid-cols-[61%_37.8%] search-gap w-[100%]';

        input.appendChild(img);
        this.appendChild(input);
        this.appendChild(submit);

        this.styleResultPanel();
        this.appendChild(this.#results);

    }
}

customElements.define('search-form', Searchbar, { extends: 'form' });
