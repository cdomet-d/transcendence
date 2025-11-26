import { Avatar } from '../typography/images.js';
import { Biography, Username, Winstreak } from './user-atoms.js';
import { createSocialMenu } from '../navigation/menu-helpers.js';
import { social } from '../navigation/default-menus.js';
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
        this.#actionButtons = createSocialMenu(social, 'horizontal');
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
        if (status !== this.#username.status) {
            // console.log('status');
            this.#username.status = status;
        }
    }

    /**
     * Sets the user's avatar image data.
     */
    set avatar(profilePic: ImgData) {
        if (this.#avatar.metadata !== profilePic) {
            this.#avatar.metadata = profilePic;
            this.#avatar.classList.add('row-span-3', 'place-self-center');
        }
    }

    /**
     * Sets the user's biography text.
     */
    set biography(bio: string) {
        if (bio !== this.#biography.content) {
            this.#biography.content = bio;
            this.#biography.classList.add('row-span-2');
        }
    }

    /**
     * Sets the user's winstreak value.
     */
    set winstreak(val: string) {
        if (val !== this.#winstreak.winstreakValue) {
            this.#winstreak.winstreakValue = val;
        }
    }

    /**
     * Sets the profile view type for the action menu.
     */
    set profileView(v: ProfileView) {
        if (this.#actionButtons.view !== v) {
            this.#actionButtons.view = v;
        }
    }

    /**
     * Sets the user's profile age (days since joined).
     */
    set profileAge(val: string) {
        if (this.#joinedSince.textContent !== `Joined ${val} days ago`) {
            this.#joinedSince.textContent = `Joined ${val} days ago`;
        }
    }

    /**
     * Sets the user's username.
     */
    set username(name: string) {
        if (this.#username.name !== name) {
            this.#username.name = name;
        }
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
        this.avatar = user.avatar;
        this.biography = user.biography;
        this.color = user.profileColor;
        this.profileAge = user.since;
        this.profileId = user.id;
        this.profileView = user.relation;
        this.status = user.status;
        this.username = user.username;
        this.winstreak = user.winstreak;
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
        this.className = `pad-s box-border brdr ${this.#color}`;
        this.#username.customizeStyle('f-yellow', 'f-m', 'f-bold', false);
        this.#joinedSince.classList.add('place-self-center', 'dark');
        this.#biography.classList.add('row-span-2');
        this.#avatar.classList.add('row-span-3', 'place-self-center');
        this.classList.add('grid', 'gap-s', 'user-profile-header-grid');
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
    constructor() {
        super();
    }

    override connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    override render() {
        this.append(super.getAvatar, super.getUsername, super.getWinstreak);
        super.getUsername.customizeStyle('f-yellow', 'f-s', 'f-bold', true);
        this.classList.add(
            'cursor-pointer',
            'gap-s',
            'flex',
            'flex-initial',
            'pad-xs',
            `${super.getColor}`,
        );
    }
}

if (!customElements.get('user-inline')) {
    customElements.define('user-inline', UserInline, { extends: 'div' });
}
