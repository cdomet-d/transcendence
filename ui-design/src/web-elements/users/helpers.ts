import { Avatar } from '../typography/images';
import { Biography, Username, Winstreak } from './user-atoms';
import { createAvatar } from '../typography/helpers';
import { createSocialMenu } from '../navigation/helpers';
import { Notification } from './notifications';
import { SocialMenu } from '../navigation/menus';
import { UserCardSocial, UserInline } from './profile';
import * as types from '../../types-interfaces';

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
    el.status = status;
    return el;
}

export function createWinstreak(val: string): Winstreak {
    const el = document.createElement('span', { is: 'winstreak-block' }) as Winstreak;
    el.winstreakValue = val;
    return el;
}

export function createBiography(val: string): Biography {
    const el = document.createElement('p', { is: 'user-bio' }) as Biography;
    el.content = val;
    return el;
}

/**
 * Creates a user card element with avatar, username, and social menu.
 *
 * @param socialBtns - Array of social button metadata. ({@link types.buttonData})
 * @param user - The user data object ({@link types.UserData}).
 * @returns A `UserCardSocial` element populated with user info and social buttons.
 */
export function createUserCardSocial(
    socialBtns: Array<types.buttonData>,
    user: types.UserData,
    view: types.ProfileView,
): UserCardSocial {
    const avatarCpy = { ...user.avatar };
    avatarCpy.size = 'imedium';
    const avatar = createAvatar(avatarCpy) as Avatar;
    const username = createUsername(user.username, user.status) as Username;
    const menu = createSocialMenu(socialBtns, 'horizontal', view);
    const card = document.createElement('div', { is: 'user-card-social' }) as UserCardSocial;
    card.append(avatar, username, menu);
    username.customizeStyle('f-yellow', 'f-m', 'f-bold', true);
    card.backgroundColor = user.profileColor;
    card.id = user.id;
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
    const avatarCpy = { ...user.avatar };
    avatarCpy.size = 'iicon';
    const avatar = createAvatar(avatarCpy);
    const username = createUsername(user.username, user.status);
    const wstreak = createWinstreak(user.winstreak);
    const card = document.createElement('div', { is: 'user-inline' }) as UserInline;

    username.customizeStyle('f-orange', 'f-regular');
    card.id = user.id;
    card.append(avatar, username, wstreak);
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
 * Updates the avatar image for a user card.
 *
 * @param newProfilePicture - New avatar image metadata.
 * @param userId - The ID of the user card to update.
 */
export function updateProfileColor(newColor: string, userId: string) {
    document.addEventListener('DOMContentLoaded', () => {
        const userCard = document.getElementById(userId) as UserCardSocial;
        if (userCard) {
            userCard.backgroundColor = newColor;
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
            const username = userCard.querySelector('#username') as Username;
            username.status = status;
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
            const username = userCard.querySelector('#username') as Username;
            username.name = newUserName;
        }
    });
}

export function createNotificationBox(): Notification {
    const el = document.createElement('div', { is: 'notif-container' }) as Notification;
    return el;
}

/**
 * Asynchronously retrieves the search bar element by its ID.
 *
 * Waits up to 1000 milliseconds for an element with ID 'searchbar' to appear in the DOM.
 * Checks repeatedly every 100 milliseconds until found or timeout elapses.
 *
 * @returns {Promise<Searchbar | null>} A promise that resolves with the {@link Searchbar} element if found, or `null` if not found within the timeout.
 */
export function getNotificationBoxAsync(): Promise<Notification | null> {
    const timeout: number = 1000;
    const start = Date.now();
    return new Promise((resolve) => {
        function resolveSearchbar() {
            const s = document.getElementById('notificationWrapper') as Notification | null;
            if (s) {
                resolve(s);
            } else {
                if (Date.now() - start >= timeout) resolve(null);
                else setTimeout(resolveSearchbar, 100);
            }
        }
        resolveSearchbar();
    });
}

// export function assembleUserSettings(user: types.UserData): UserSettingsWrapper {
//     const el = document.createElement('div', { is: 'settings-wrapper' }) as UserSettingsWrapper;
//     const form = document.createElement('form', { is: 'settings-form' }) as UserSettingsForm;
// 	const avatar = createAvatar(user.avatar);
// 	form.setUsername = user.username;
//     el.append(avatar, form);
//     return el;
// }
