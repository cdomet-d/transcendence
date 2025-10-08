import type { ImgMetadata } from '../../types-interfaces';

/**
 * Custom image element representing an icon.
 * Extends the native HTMLImageElement.
 */
export class Icon extends HTMLImageElement {
    #data: ImgMetadata;

    constructor() {
        super();
        this.#data = {
            src: '',
            alt: '',
            size: 'ismall',
            id: '',
        };
    }

    set metadata(data: ImgMetadata) {
        this.#data = data;
    }
    connectedCallback() {
        this.render();
    }

    render() {
        this.className = `${this.#data.size} isize`;
        this.src = this.#data.src;
        this.alt = this.#data.alt;
		this.setAttribute("id", this.#data.id);
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
    #img: Icon;
    #data: ImgMetadata;

    constructor() {
        super();
        this.#data = {
            src: '/assets/icons/default-avatar.png',
			id: 'default-avatar',
            alt: "A pixel art blue blob with a neutral expression, the site's default avatar",
            size: 'imedium',
        };
        this.#img = document.createElement('img', { is: 'custom-icon' }) as Icon;
        this.#img.metadata = this.#data;
        this.appendChild(this.#img);
    }

    set metadata(data: ImgMetadata) {
        this.#data = data;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = `${
            this.#data.size
        } avatar-wrapper flex justify-center overflow-hidden rounded-[100px] box-border`;
        this.#img.metadata = this.#data;
    }
}

customElements.define('user-avatar', Avatar, { extends: 'div' });
