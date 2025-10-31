import type { ImgData } from '../../types-interfaces';
import { createIcon } from './helpers';

/**
 * Custom image element representing an icon.
 * Extends the native HTMLImageElement.
 */
export class Icon extends HTMLImageElement {
    #data: ImgData;

    constructor() {
        super();
        this.#data = { src: '', alt: '', size: 'iicon', id: '' };
    }

    set metadata(data: ImgData) {
        this.#data = data;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = `${this.#data.size} isize`;
        this.src = this.#data.src;
        this.alt = this.#data.alt;
        this.setAttribute('id', this.#data.id);
    }
}

if (!customElements.get('custom-icon')) {
    customElements.define('custom-icon', Icon, { extends: 'img' });
}

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
    #img: Icon;
    #data: ImgData;

    constructor() {
        super();
        this.#data = {
            src: '/assets/icons/default-avatar.png',
            id: 'default-avatar',
            alt: "A pixel art blue blob with a neutral expression, the site's default avatar",
            size: 'iicon',
        };
        this.#img = document.createElement('img', { is: 'custom-icon' }) as Icon;
        this.#img.metadata = this.#data;
        this.append(this.#img);
    }

    set metadata(data: ImgData) {
        this.#data = data;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.id = 'avatar';
        this.className = `${
            this.#data.size
        } avatar-wrapper flex justify-center overflow-hidden rounded-[100px] box-border`;
        this.#img.metadata = this.#data;
    }
}

if (!customElements.get('user-avatar')) {
    customElements.define('user-avatar', Avatar, { extends: 'div' });
}

export class NoResults extends HTMLDivElement {
    #noResultsImg: ImgData;

    constructor() {
        super();
        this.#noResultsImg = {
            alt: 'A crying blue pixel art blob',
            id: 'no-results',
            size: 'ilarge',
            src: 'assets/icons/no-result.png',
        };
    }

    connectedCallback() {
        const img = createIcon(this.#noResultsImg);
        const p = document.createElement('p');
        p.innerText = "There's nothing here :<";
        this.append(p, img);
        img.classList.add('breathe', 'justify-self-center');
        this.render();
    }

    render() {
        this.className = 'w-full box-border grid justify-center';
    }
}

if (!customElements.get('no-results')) {
    customElements.define('no-results', NoResults, { extends: 'div' });
}
