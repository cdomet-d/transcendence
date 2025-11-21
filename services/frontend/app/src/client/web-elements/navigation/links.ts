import type { navigationLinksData } from '../types-interfaces.js';
import { createIcon } from '../typography/helpers.js';
import { router } from '../../main.js';

const emptyLink: navigationLinksData = { id: '', datalink: '', href: '', title: '', img: null };

export class NavigationLinks extends HTMLAnchorElement {
    #info: navigationLinksData;
    #animated: boolean;

    #clickHandler: (ev: Event) => void;

    constructor() {
        super();
        this.#info = emptyLink;
        this.#animated = false;
        this.#clickHandler = this.#loadNewPage.bind(this);
    }

    set info(data: navigationLinksData) {
        this.#info = data;
    }

    get info() {
        return this.#info;
    }

    /**
     * Enables or disables animated text rendering.
     * @param {boolean} b - Animation toggle flag.
     */
    set animation(b: boolean) {
        this.#animated = b;
    }

    #loadNewPage(ev: Event) {
        const link = (ev.target as HTMLElement).closest('[data-link]');
        if (link) {
            ev.preventDefault();
            const path = link.getAttribute('href');
            if (path) {
                router.loadRoute(path);
            }
        }
    }

    /** Renders simple textual button content. */
    #renderTextLink() {
        this.textContent = this.#info.title;
    }

    /** Renders button icon if image metadata is provided. */
    #renderIconLink() {
        if (this.#info.img) {
            const icon = createIcon(this.#info.img);
            this.append(icon);
        }
    }

    /** Renders animated button text letter-by-letter. */
    #renderAnimatedLink() {
        let index: number = 0;
        for (const char of this.#info.title!) {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = char;
            letterSpan.style.animationDelay = `${index}s`;
            letterSpan.classList.add('f-brown', 'f-bold', 'whitepre');
            this.append(letterSpan);
            index += 0.1;
        }
        this.classList.add('t2', 'button-shadow');
    }

    styleButton() {
        this.classList.add(
            'brdr',
            'input-emphasis',
            'whitenowrap',
            'button',
            'bg-yellow',
            'w-full',
        );
    }

    connectedCallback() {
        this.addEventListener('click', this.#clickHandler);
        this.render();
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.#clickHandler);
    }

    render() {
        this.className =
            'box-border pad-xs outline-hidden \
			overflow-hidden  cursor-pointer   text-center \
			hover:transform hover:scale-[1.02] \
			focus-visible:transform focus-visible:scale-[1.02]';
        if (this.#info.img) this.#renderIconLink();
        else if (this.#info.title && !this.#animated) {
            this.#renderTextLink();
            this.styleButton();
        } else if (this.#info.title && this.#animated) {
            this.#renderAnimatedLink();
            this.styleButton();
        }
        this.href = this.#info.href;
        this.title = this.#info.title;
        this.id = this.#info.id;
        this.setAttribute('data-link', this.#info.datalink);
    }
}

if (!customElements.get('nav-link')) {
    customElements.define('nav-link', NavigationLinks, { extends: 'a' });
}
