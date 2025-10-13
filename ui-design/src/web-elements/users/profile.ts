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
            'cursor-pointer gap-m box-border flex flex-initial items-center hover:bg-(--transparent-blue)';
    }
}

customElements.define('user-inline', UserInline, { extends: 'div' });
