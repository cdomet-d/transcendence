import type { FontWeight, FontSize, ImgMetadata } from '../../types-interfaces';
import { createIcon } from '../typography/helpers';
import type { Icon } from '../typography/images';
import { createUserCardSocial, createUserInline } from './helpers';

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
        this.#link.href = `/api/users/${val}`;
        this.render();
    }

    set fontSize(val: FontSize) {
        this.#link.classList.add(val);
        this.render();
    }

    set fontWeight(val: FontWeight) {
        this.#link.classList.add(val);
        this.render();
    }

    set shadow(val: boolean) {
        if (val) this.#link.classList.add('tiny-shadow');
        this.render();
    }

    /**
     * Updates the login status.
     * @param isLogged - Whether the user is logged in.
     */
    set updateStatus(isLogged: boolean) {
        this.#isLogged = isLogged;
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
        this.className = 'f-yellow f-s grid gap-s username justify-items-center';
        this.#link.classList.add('flex', 'items-center');
        if (this.#isLogged) {
            this.#status.classList.add('true');
        } else {
            this.#status.classList.add('false');
        }
    }
}

customElements.define('username-container', Username, { extends: 'div' });

export class WinStreak extends HTMLSpanElement {
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
        this.className = 'flex flex-initial gap-xs items-center';
        this.#val.className = 'username f-yellow text-[16px]';
        this.id = 'winstreak';
    }
}

customElements.define('winstreak-block', WinStreak, { extends: 'span' });

/**
 * A small user card with a dynamic social menu. It's just a div, styled to hold
 * an avatar, a username and the social menu. The profile card is identified by the userID of the user it represents,
 * to allow later selection and dynamic UI updates (logging in/out, the users becoming friends, avatar or username changes...).
 *
 * @setter Id - used to set the container `id` attribute.
 *
 * @remark You should use {@link createUserCardSocial} which encapsulates creation logic.
 */
export class UserCardSocial extends HTMLDivElement {
    constructor() {
        super();
    }
    set Id(id: string) {
        this.id = id;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = 'border-box pad-s grid place-items-center small-user';
    }
}

customElements.define('user-card-social', UserCardSocial, { extends: 'div' });

/**
 * Inline profile for listing users. It's just a div, styled to hold
 * an avatar, a username and the user's winstreak. 
 
 * Like UserCardSocial, it relies on the user's id for dynamic UI updates.
 *
 * @setter Id - used to set the container `id` attribute.
 *
 * @remark You should use {@link createUserInline} which encapsulates creation logic.
 */
export class UserInline extends HTMLDivElement {
    constructor() {
        super();
    }

    set Id(id: string) {
        this.id = id;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = 'gap-m box-border flex flex-initial items-center';
    }
}

customElements.define('user-inline', UserInline, { extends: 'div' });
