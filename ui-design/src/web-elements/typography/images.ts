import type { Size } from '../../web-element-helpers/typography/typo-helper-modules.js';

/**
 * Custom image element representing an icon.
 * Extends the native HTMLImageElement.
 */
export class Icon extends HTMLImageElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = 'ismall isize';
    }
}

customElements.define('custom-icon', Icon, { extends: 'img' });

/**
 * Custom avatar container element with three size options.
 * Extends HTMLDivElement and contains an internal image element.
 *
 * @remarks
 * Size options: 's', 'm', 'l'. Default is 'm'.
 *
 * @see {@link Size} for sizing.
 */
export class Avatar extends HTMLDivElement {
    #img: HTMLImageElement;
    #size: string;

    constructor() {
        super();
        this.#size = 'm';
        this.#img = document.createElement('img');
        this.appendChild(this.#img);
    }

    set size(s: Size) {
        this.#size = s;
    }

    set src(src: string) {
        this.#img.setAttribute('src', src);
    }

    set alt(alt: string) {
        this.#img.setAttribute('alt', alt);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = 'avatar-wrapper flex justify-center overflow-hidden rounded-[100px] box-border';
        if (this.#size === 's') this.classList.add('ismall');
        else if (this.#size === 'm') this.classList.add('imedium');
        else if (this.#size === 'l') this.classList.add('ilarge');
    }
}

customElements.define('user-avatar', Avatar, { extends: 'div' });
