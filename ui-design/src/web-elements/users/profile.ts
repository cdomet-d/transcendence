import { createSocialMenu } from '../navigation/helpers';
import type { SocialMenu } from '../navigation/menus';
import type { Avatar } from '../typography/images';
import { createUserCardSocial, createUserInline } from './helpers';
import type { Biography, Username, Winstreak } from './user-atoms';
import * as defaults from '../../default-values';
import * as types from '../../types-interfaces';
import { profile } from 'console';

/**
 * A small user card with a dynamic social menu. It's just a div, styled to hold
 * an avatar, a username and the social menu. The profile card is identified by the userID of the user it represents,
 * to allow later selection and dynamic UI updates (logging in/out, the users becoming friends, avatar or username changes...).
 *
 * @setter Id - used to set the container `id` attribute.
 *
 * @remark You should use {@link createUserCardSocial} which encapsulates creation logic.
 */

// <div class="profile-header">
// 	<div class="avatar-wrapper-l two-rows">
// 		<img src="../assets/icons/light-green-avatar.png" />
// 	</div>
// 	<div class="username"> %username% <div class="user-status"></div>
// 	</div>
// 	<span class="since"> Joined %d days ago </span>
// 	<p class="biography two-rows">
// 		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae aliquam mi. Aliquam
// 		vulputate augue sed risus consectetur, quis auctor odio maximus. Nullam volutpat, justo eu suscipit
// 		condimentum, risus metus ultrices quam, eu tempor erat tellus vitae mauris. Quisque sed odio sed
// 		ipsum lacinia finibus non ac enim. Sed sagittis vel. Lorem ipsum dolor sit amet, consectetur
// 		adipiscing elit. Aliquam vitae aliquam mi. Aliquam
// 		vulputate augue sed risus consectetur, quis auctor odio maximus. Nullam volutpat, justo eu suscipit
// 		condimentum, risus metus ultrices quam, eu tempor erat tellus vitae mauris. Quisque sed odio sed
// 		ipsum lacinia finibus non ac enim. Sed sagittis vel. </p>
// 	<span class="rank"> %NB%</span>
// 	<div class="vertical-menu-wrapper">
// 		<button class="thin-border button-bg" type="button"> Settings </button>
// 	</div>
// </div>
export class UserProfile extends HTMLDivElement {
    #actionButtons: SocialMenu;
    #avatar: Avatar;
    #biography: Biography;
    #joinedSince: HTMLSpanElement;
    #username: Username;
    #winstreak: Winstreak;
    #color: string;

    constructor() {
        super();
        this.#actionButtons = createSocialMenu(defaults.socialMenu, 'vertical', 'stranger');
        this.#avatar = document.createElement('div', { is: 'user-avatar' }) as Avatar;
        this.#biography = document.createElement('p') as Biography;
        this.#joinedSince = document.createElement('span') as HTMLSpanElement;
        this.#username = document.createElement('div', { is: 'username-container' }) as Username;
        this.#winstreak = document.createElement('span', { is: 'winstreak-block' }) as Winstreak;
        this.#color = 'bg-4F9FFF';
    }

    set avatar(profilePic: types.ImgMetadata) {
        this.#avatar.metadata = profilePic;
    }

    set biography(bio: string) {
        this.#biography.content = bio;
    }

    set winstreak(val: string) {
        this.#winstreak.winstreakValue = val;
    }

    set profileView(v: types.ProfileView) {
        this.#actionButtons.view = v;
    }

    set profileAge(val: string) {
        this.#joinedSince.textContent = val;
    }

    set username(name: string) {
        this.#username.name = name;
    }

    set color(newColor: string) {
        if (this.#color !== newColor) {
            this.classList.remove(this.#color);
            this.classList.add(newColor);
            this.#color = newColor;
        }
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
            this.#winstreak,
            this.#actionButtons
        );
		this.className = `${this.#color}`
    }
}

if (!customElements.get('user-profile')) {
    customElements.define('user-profile', UserProfile, { extends: 'div' });
}

export class UserCardSocial extends UserProfile {

    constructor() {
        super();
    }

    override connectedCallback() {
        this.render();
    }

    override render() {
		console.log(super.#color)
        this.className = 'border-box pad-s grid place-items-center gap-s min-h-fit ';
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
