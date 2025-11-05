import type { FontWeight, FontSize, FontColor, ImgData } from '../types-interfaces.js';
import { createIcon } from '../typography/helpers.js';
import type { Icon } from '../typography/images.js';

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
        this.append(this.#name, this.#status);
    }

    /**
     * Sets the username text.
     */
    set name(val: string) {
        this.#link.innerText = val;
        //TODO: HUUUUM...
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

    /**
     * Applies custom styles to the username link element.
     *
     * @param fcolor - Optional font color class to apply.
     * @param fsize - Optional font size class to apply.
     * @param fweight - Optional font weight class to apply.
     * @param shadow - Whether to add a shadow class to the username.
     */
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

/**
 * Custom element for displaying a winstreak icon and the value of said winstreak.
 * Extends HTMLSpanElement.
 */
export class Winstreak extends HTMLSpanElement {
    #icon: Icon;
    #val: HTMLSpanElement;

    constructor() {
        super();
        const iconData: ImgData = {
            src: '/public/images/winstreak.png',
            id: '',
            alt: 'A gold pixel trophy with the number 1 engraved in a darker color.',
            size: 'iicon',
        };
        this.#icon = createIcon(iconData);
        this.#val = document.createElement('p');
        this.append(this.#icon, this.#val);
    }

    /**
     * Sets the winstreak value text.
     * @param val - The winstreak value to display.
     */
    set winstreakValue(val: string) {
        this.#val.innerText = val;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.id = 'winstreak';
        this.className = 'flex flex-initial gap-s items-center even';
        this.#val.className = 'f-bold text-[16px]';
    }
}

if (!customElements.get('winstreak-block')) {
    customElements.define('winstreak-block', Winstreak, { extends: 'span' });
}

/**
 * Custom element for displaying a user biography.
 * Extends HTMLParagraphElement.
 */
export class Biography extends HTMLParagraphElement {
    constructor() {
        super();
    }

    /**
     * Sets the biography content.
     * @param val - The biography text to display.
     */
    set content(val: string) {
        this.textContent = val;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.id = 'biography';
        this.className = 'box-border max-h[6.5rem] leading-[1rem] biography place-self-stretch';
    }
}

if (!customElements.get('user-bio')) {
    customElements.define('user-bio', Biography, { extends: 'p' });
}
