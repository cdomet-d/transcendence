import type { buttonData, InputMetadata } from '../../types-interfaces';
import { createInputGrp } from '../inputs/helpers';
import { usernamePattern } from '../../default-values';
import { createBtn } from './helpers';

export class Searchbar extends HTMLFormElement {
    #input: InputMetadata;
    #btn: buttonData;

    constructor() {
        console.log('Searchbar constructor');

        super();
        // this.#icon = {
        //     src: '/assets/icons/search-icon.png',
        //     alt: 'A pixel art magnifier',
        //     id: '',
        //     size: 'ismall',
        // };
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
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.role = 'search';

        const img = document.createElement('img');
        const input = createInputGrp(this.#input);
        const submit = createBtn(this.#btn);

        this.action = '/api/search';
        this.method = 'get';
        this.className = 'items-center box-border grid grid-cols-[61%_37.8%] gap-s w-[100%]';
        img.className = 'w-s h-s absolute top-[6px] left-[6px]';
        img.src = '/assets/icons/search-icon.png';
        img.alt = 'A pixel art magnifier';
        input.appendChild(img);

        this.appendChild(input);
        this.appendChild(submit);
    }
}

customElements.define('search-form', Searchbar, { extends: 'form' });
