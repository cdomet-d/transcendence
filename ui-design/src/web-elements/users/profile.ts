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

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = 'gap-m box-border flex flex-initial items-center';
    }
}

customElements.define('user-inline', UserInline, { extends: 'div' });
