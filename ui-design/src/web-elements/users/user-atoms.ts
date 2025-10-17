import type { FontWeight, FontSize, FontColor, ImgMetadata } from '../../types-interfaces';
import { createIcon } from '../typography/helpers';
import type { Icon } from '../typography/images';

/**
 * Custom element for displaying a username with status.
 * Extends HTMLDivElement.
 */
export class Username extends HTMLDivElement {
    #status: HTMLDivElement;
    #name: HTMLDivElement;
    #link: HTMLAnchorElement;
    #isLogged: boolean;

    // TODO: make the user-status a percentage of username fontSize ?
    /**
     * Initializes the username and status elements.
     * Sets initial logged status to false.
     */
    constructor() {
        super();
        this.#isLogged = false;
        this.#status = document.createElement('div');
        this.#name = document.createElement('div');
        this.#link = document.createElement('a');
        this.#name.append(this.#link);
        this.appendChild(this.#name);
        this.appendChild(this.#status);
    }

    /**
     * Sets the username text.
     */

    set name(val: string) {
        this.#link.innerText = val;
        this.#link.href = `/users/${val}`;
        this.render();
    }

    /**
     * Updates the login status.
     * @param isLogged - Whether the user is logged in.
     */
    set status(isLogged: boolean) {
        this.#isLogged = isLogged;
        this.render();
    }

    customizeStyle(fcolor?: FontColor, fsize?: FontSize, fweight?: FontWeight, shadow?: boolean) {
        if (fsize) this.#link.classList.add(fsize);
        if (fcolor) this.#link.classList.add(fcolor);
        if (fweight) this.#link.classList.add(fweight);
        if (shadow) this.#link.classList.add('tiny-shadow');
        this.render();
    }

    /** Called when element is added to the document. */
    connectedCallback() {
        this.render();
    }

    /**
     * Sets up styles and updates status class.
     * Adds 'true' class if logged in, else 'false'. This toggles the color change.
     */
    render() {
        this.id = 'username';
        this.#status.className = 'user-status';
        this.className = 'true false f-yellow f-s grid gap-s username justify-items-center';
        this.#link.classList.add('flex', 'items-center');
        if (this.#isLogged) {
            this.#status.classList.toggle('true');
        } else {
            this.#status.classList.toggle('false');
        }
    }
}

if (!customElements.get('username-container')) {
    customElements.define('username-container', Username, { extends: 'div' });
}

export class Winstreak extends HTMLSpanElement {
    #icon: Icon;
    #val: HTMLSpanElement;

    constructor() {
        super();
        const iconData: ImgMetadata = {
            src: '/assets/icons/winstreak.png',
            id: '',
            alt: 'A gold pixel trophy with the number 1 engraved in a darker color.',
            size: 'iicon',
        };
        this.#icon = createIcon(iconData);
        this.#val = document.createElement('p');
        this.appendChild(this.#icon);
        this.appendChild(this.#val);
    }

    set winstreakValue(val: string) {
        this.#val.innerText = val;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.id = 'winstreak';
        this.className = 'flex flex-initial gap-xs items-center space-even';
        this.#val.className = 'f-bold text-[16px]';
    }
}

if (!customElements.get('winstreak-block')) {
    customElements.define('winstreak-block', Winstreak, { extends: 'span' });
}

export class Biography extends HTMLParagraphElement {
    constructor() {
        super();
    }
    set bioContent(val: string) {
        this.textContent = val;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.id = 'biography';
        this.className = 'border-box w-[full] max-h[6.5rem] leading-[1rem] biography';
    }
}

if (!customElements.get('user-bio')) {
    customElements.define('user-bio', Biography, { extends: 'p' });
}
