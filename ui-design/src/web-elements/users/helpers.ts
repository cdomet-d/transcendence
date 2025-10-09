import { UserCardSocial, Username, UserInline, WinStreak } from './user-atoms';
import * as types from '../../types-interfaces';
import { createAvatar } from '../typography/helpers';
import { createSocialMenu } from '../navigation/helpers';
import { Avatar } from '../typography/images';
import type { SocialMenu } from '../navigation/menus';

/**
 * Creates a custom `Username` element displaying specified name and status.
 *
 * @param username - The username text to assign to the element.
 * @param status - The status value to set on the element. Allows to change the color of the token next to the username.
 * @returns A `Username` element with the given name and status set.
 */
export function createUsername(username: string, status: boolean): Username {
    const el = document.createElement('div', { is: 'username-container' }) as Username;
    el.name = username;
    el.updateStatus = status;
    return el;
}

export function createWinstreak(val: string): WinStreak {
    const el = document.createElement('span', { is: 'winstreak-block' }) as WinStreak;
    el.winstreakValue = val;
    return el;
}

/**
 * Creates a user card element with avatar, username, and social menu.
 *
 * @param socialBtns - Array of social button metadata. ({@link types.BtnMetadata})
 * @param user - The user data object ({@link types.UserData}).
 * @returns A `UserCardSocial` element populated with user info and social buttons.
 */
export function createUserCardSocial(
    socialBtns: Array<types.BtnMetadata>,
    user: types.UserData,
): UserCardSocial {
    const avatar = createAvatar(user.avatar);
    const username = createUsername(user.username, user.status);
    username.fontSize = 'f-m';
    username.fontWeight = 'f-bold';
    username.shadow = true;
    const menu = createSocialMenu(socialBtns, 'horizontal', 'stranger');
    const card = document.createElement('div', { is: 'user-card-social' }) as UserCardSocial;
    card.id = user.id;
    card.appendChild(avatar);
    card.appendChild(username);
    card.appendChild(menu);
    return card;
}

/**
 * Creates an inline user profile element containing avatar, username, and winstreak.
 *
 * @param user - The user data object ({@link types.UserData}).
 * @returns A `UserInline` element populated with the user's avatar, username, and winstreak.
 *
 */
export function createUserInline(user: types.UserData): UserInline {
    user.avatar.size = 'iicon';
    const avatar = createAvatar(user.avatar);
    const username = createUsername(user.username, user.status);
    const wstreak = createWinstreak(user.winstreak);
    const card = document.createElement('div', { is: 'user-inline' }) as UserInline;

    username.fontSize = 'f-regular';
    card.id = user.id;
    card.appendChild(avatar);
    card.appendChild(username);
    card.appendChild(wstreak);
    return card;
}

/**
 * Updates the avatar image for a user card.
 *
 * @param newProfilePicture - New avatar image metadata.
 * @param userId - The ID of the user card to update.
 */
export function updateUserAvatar(newProfilePicture: types.ImgMetadata, userId: string) {
    document.addEventListener('DOMContentLoaded', () => {
        const userCard = document.getElementById(userId) as UserCardSocial;
        if (userCard) {
            const oldProfilePicture = userCard.querySelector('#avatar') as Avatar;
            oldProfilePicture.metadata = newProfilePicture;
        }
    });
}

/**
 * Updates the social menu view for a user card.
 *
 * @param newView - New profile view type.
 * @param userId - The ID of the user card to update.
 */
export function updateProfileView(newView: types.ProfileView, userId: string) {
    document.addEventListener('DOMContentLoaded', () => {
        const userCard = document.getElementById(userId) as UserCardSocial;
        if (userCard) {
            const oldView = userCard.querySelector('#social-menu') as SocialMenu;
            oldView.view = newView;
        }
    });
}

/**
 * Updates the status indicator for a user's username.
 *
 * @param status - New status value.
 * @param userId - The ID of the user card to update.
 */
export function updateUserStatus(status: boolean, userId: string) {
    document.addEventListener('DOMContentLoaded', () => {
        const userCard = document.getElementById(userId) as UserCardSocial;
        if (userCard) {
            const usernm = userCard.querySelector('#username') as Username;
            usernm.updateStatus = status;
        }
    });
}

/**
 * Updates the username text for a user card.
 *
 * @param newUserName - New username string.
 * @param userId - The ID of the user card to update.
 */
export function updateUsername(newUserName: string, userId: string) {
    document.addEventListener('DOMContentLoaded', () => {
        const userCard = document.getElementById(userId) as UserCardSocial;
        if (userCard) {
            const usernm = userCard.querySelector('#username') as Username;
            usernm.name = newUserName;
        }
    });
}
