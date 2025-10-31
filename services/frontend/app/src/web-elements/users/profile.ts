import { Avatar } from '../typography/images.js';
import { Biography, Username, Winstreak } from './user-atoms.js';
import { createSocialMenu } from '../navigation/menu-helpers.js';
import { socialMenu } from '../default-values.js';
import { SocialMenu } from '../navigation/menus.js';
import type { UserData, ImgData, ProfileView } from '../types-interfaces.js';

/**
 * Custom element representing a user profile.
 * Displays avatar, username, status, winstreak, biography, profile age, and action menu.
 * Extends HTMLDivElement.
 */
export class UserProfile extends HTMLDivElement {
    #actionButtons: SocialMenu;
    #avatar: Avatar;
    #biography: Biography;
    #joinedSince: HTMLSpanElement;
    #username: Username;
    #winstreak: Winstreak;
    #color: string;

    /**
     * Initializes the UserProfile element and its child components.
     */
    constructor() {
        super();
        this.#actionButtons = createSocialMenu(socialMenu, 'horizontal', 'stranger');
        this.#avatar = document.createElement('div', { is: 'user-avatar' }) as Avatar;
        this.#biography = document.createElement('p', { is: 'user-bio' }) as Biography;
        this.#joinedSince = document.createElement('span') as HTMLSpanElement;
        this.#username = document.createElement('div', { is: 'username-container' }) as Username;
        this.#winstreak = document.createElement('span', { is: 'winstreak-block' }) as Winstreak;
        this.#color = 'bg-4F9FFF';
    }

    /**
     * Sets the profile ID (container id attribute).
     */
    set profileId(userId: string) {
        this.id = userId;
    }

    /**
     * Sets the user's status (online/offline).
     */
    set status(status: boolean) {
        this.#username.status = status;
    }

    /**
     * Sets the user's avatar image data.
     */
    set avatar(profilePic: ImgData) {
        this.#avatar.metadata = profilePic;
    }

    /**
     * Sets the user's biography text.
     */
    set biography(bio: string) {
        this.#biography.content = bio;
    }

    /**
     * Sets the user's winstreak value.
     */
    set winstreak(val: string) {
        this.#winstreak.winstreakValue = val;
    }

    /**
     * Sets the profile view type for the action menu.
     */
    set profileView(v: ProfileView) {
        this.#actionButtons.view = v;
    }

    /**
     * Sets the user's profile age (days since joined).
     */
    set profileAge(val: string) {
        this.#joinedSince.textContent = `Joined ${val} days ago`;
    }

    /**
     * Sets the user's username.
     */
    set username(name: string) {
        this.#username.name = name;
    }

    /**
     * Sets the profile color and updates the class.
     */
    set color(newColor: string) {
        if (this.#color !== newColor) {
            this.classList.remove(this.#color);
            this.#color = newColor;
            this.classList.add(this.#color);
        }
    }

    /**
     * Sets all user information at once from a UserData object.
     */
    set userInfo(user: UserData) {
        this.profileId = user.id;
        this.avatar = user.avatar;
        this.username = user.username;
        this.status = user.status;
        this.winstreak = user.winstreak;
        this.profileView = user.relation;
        this.biography = user.biography;
        this.profileAge = user.since;
        this.color = user.profileColor;
    }

    get getAvatar() {
        return this.#avatar;
    }

    get getBiography() {
        return this.#biography;
    }

    get getWinstreak() {
        return this.#winstreak;
    }

    get getProfileAge() {
        return this.#joinedSince;
    }

    get getUsername() {
        return this.#username;
    }

    get getColor() {
        return this.#color;
    }

    get getActionMenu() {
        return this.#actionButtons;
    }

    connectedCallback() {
        this.className = `pad-xs box-border items-center place-items-center justify-items-center thin brdr ${
            this.#color
        }`;
        this.render();
    }

    render() {
        this.append(
            this.#avatar,
            this.#username,
            this.#joinedSince,
            this.#biography,
            this.#actionButtons,
            this.#winstreak,
        );
        this.#username.customizeStyle('f-yellow', 'f-m', 'f-bold', true);
        this.#joinedSince.classList.add('f-clear');
        this.#biography.classList.add('row-span-2', 'f-clear');
        this.#avatar.classList.add('row-span-3');
        this.classList.add('grid', 'user-profile-header-grid');
    }
}

if (!customElements.get('user-profile')) {
    customElements.define('user-profile', UserProfile, { extends: 'div' });
}

/**
 * A small user card with a dynamic social menu. It's just a div, styled to hold
 * an avatar, a username and the social menu. The profile card is identified by the userID of the user it represents,
 * to allow later selection and dynamic UI updates (logging in/out, the users becoming friends, avatar or username changes...).
 *
 * @setter Id - used to set the container `id` attribute.
 *
 * @remark You should use {@link createUserCardSocial} which encapsulates creation logic.
 */
export class UserCardSocial extends UserProfile {
    constructor() {
        super();
    }

    override render() {
        this.append(super.getAvatar, super.getUsername, super.getActionMenu);
        super.getUsername.customizeStyle('f-yellow', 'f-s', 'f-bold', true);
        this.classList.add('grid', 'gap-s', 'min-h-fit', 'min-w-[171px]', `${super.getColor}`);
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
export class UserInline extends UserProfile {
    #clickHandler: (ev: MouseEvent) => void;

    constructor() {
        super();
        this.#clickHandler = this.attachClick.bind(this);
    }

    /**
     * Handles click events on the element.
     * Navigates to the user's profile page.
     * @param ev - The mouse event.
     */
    attachClick(ev: MouseEvent) {
        const clickedEl = ev.target as Element | null;
        if (!clickedEl) return;
        const link = clickedEl.closest('a') || this.querySelector('a');
        if (!link) return;
        ev.preventDefault();
        // TODO: SPA routing logic goes there
        // This is a placehold in the meantime
        window.location.href = link.href;
    }
    override connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', this.#clickHandler);
        this.render();
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.#clickHandler);
    }

    override render() {
        this.append(super.getAvatar, super.getUsername, super.getWinstreak);
        super.getUsername.customizeStyle('f-yellow', 'f-s', 'f-bold', true);
        this.classList.add('cursor-pointer', 'gap-s', 'flex', 'flex-initial', `${super.getColor}`);
    }
}

if (!customElements.get('user-inline')) {
    customElements.define('user-inline', UserInline, { extends: 'div' });
}
