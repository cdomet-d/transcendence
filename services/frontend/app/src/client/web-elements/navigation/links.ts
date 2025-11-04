import type { navigationLinksData } from '../types-interfaces.js';
import { router } from '../../scripts/main.js';

const emptyLink: navigationLinksData = {
    datalink: '',
    href: '',
    title: '',
};
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

    /**
     * Enables or disables animated text rendering.
     * @param {boolean} b - Animation toggle flag.
     */
    set animation(b: boolean) {
        this.#animated = b;
    }

    #loadNewPage(ev: Event) {
		console.log('Load page')
        const link = (ev.target as HTMLElement).closest('[data-link]');
        if (link) {
            ev.preventDefault();
            const path = link.getAttribute('href');
            if (path) {
                console.log(path);
                window.history.pushState({}, '', path);
                const cleanPath = router.sanitisePath(path);
                router.loadRoute(cleanPath);
            }
        }
    }

    connectedCallback() {
		this.addEventListener('click', this.#clickHandler);
        this.render();
    }

	disconnectedCallback() {
		this.removeEventListener('click', this.#clickHandler);
	}

    /** Renders simple textual button content. */
    renderTextualBtn() {
        this.textContent = this.#info.title;
        this.classList.add(
            'hover:transform',
            'hover:scale-[1.02]',
            'focus-visible:transform',
            'focus-visible:scale-[1.02]'
        );
    }

    /** Renders animated button text letter-by-letter. */
    renderAnimatedBtn() {
        let index: number = 0;
        for (const char of this.#info.title!) {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = char;
            letterSpan.style.animationDelay = `${index}s`;
            letterSpan.classList.add('f-brown', 'f-bold', 'whitepre');
            this.append(letterSpan);
            index += 0.1;
        }
        this.classList.add('t1', 'button-shadow');
    }

    render() {
        this.className =
            'box-border brdr pad-xs input-emphasis outline-hidden \
			overflow-hidden whitenowrap cursor-pointer button bg-yellow';
        if (this.#info.title && !this.#animated) {
            this.renderTextualBtn();
        } else if (this.#info.title && this.#animated) {
            this.renderAnimatedBtn();
        }
        this.href = this.#info.href;
        this.title = this.#info.title;
        this.setAttribute('data-link', this.#info.datalink);
    }
}

if (!customElements.get('nav-link')) {
    customElements.define('nav-link', NavigationLinks, { extends: 'a' });
}
