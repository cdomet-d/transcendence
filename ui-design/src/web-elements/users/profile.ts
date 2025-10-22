import { createUserCardSocial, createUserInline } from './helpers';

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
    #color: string;

    constructor() {
        super();
        this.#color = 'bg-4F9FFF';
    }
    set Id(id: string) {
        this.id = id;
    }

    set backgroundColor(newBg: string) {
        this.#color = newBg;
        this.updateBg();
    }

    connectedCallback() {
        this.render();
    }

    updateBg() {
        const bg: RegExpMatchArray | null = this.className.match(/\bbg[\w-]*/g);
        if (!bg) {
            this.classList.add(this.#color);
            return;
        }
        bg.forEach((oc) => {
            if (oc !== this.#color) {
                this.classList.remove(oc);
                this.classList.add(this.#color, 'f-yellow');
            }
        });
    }
    render() {
        this.className = 'border-box pad-s grid place-items-center gap-s min-h-fit';
        this.updateBg();
    }
}

if (!customElements.get('user-card-social')) {
    customElements.define('user-card-social', UserCardSocial, { extends: 'div' });
}

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
    //TODO: clean up eventListener
    constructor() {
        super();
    }

    set Id(id: string) {
        this.id = id;
    }

    attachClick() {
        this.addEventListener('click', (event: MouseEvent) => {
            const clickedEl = event.target as Element | null;
            if (!clickedEl) return;
            const link = clickedEl.closest('a') || this.querySelector('a');
            if (!link) return;
            event.preventDefault();
            // TODO: SPA routing logic goes there
            // This is a placehold in the meantime
            window.location.href = link.href;
        });
    }
    connectedCallback() {
        this.render();
        this.attachClick();
    }

    render() {
        this.className =
            'cursor-pointer gap-m box-border flex flex-initial items-center hover:bg-4F9FFF';
    }
}

if (!customElements.get('user-inline')) {
    customElements.define('user-inline', UserInline, { extends: 'div' });
}
