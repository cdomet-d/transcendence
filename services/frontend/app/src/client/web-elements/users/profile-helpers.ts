import { defaultAvatar } from '../default-values.js';
import type { ImgData, Size, UserData } from '../types-interfaces.js';
import { UserProfile, UserCardSocial, UserInline } from './profile.js';

export function setAvatar(
    av: ImgData | null,
    size: Size,
    el: UserProfile | UserCardSocial | UserInline,
) {
    if (!av) av = defaultAvatar;
    const avatar = { ...av };
    avatar.size = size;
    el.avatar = avatar;
}

export function setUserProfileCommonValues(
    user: UserData,
    size: Size,
    el: UserProfile | UserCardSocial | UserInline,
) {
    el.color = user.profileColor;
    el.profileId = user.id;
    el.profileView = user.relation;
    el.status = user.status;
    el.username = user.username;
    el.winstreak = user.winstreak;
    setAvatar(user.avatar, size, el);
}

/**
 * Creates a user card element with avatar, username, and social menu.
 *
 * @param socialBtns - Array of social button metadata. ({@link ButtonData})
 * @param user - The user data object ({@link UserData}).
 * @returns A `UserCardSocial` element populated with user info and social buttons.
 */
export function createUserCardSocial(user: UserData): UserCardSocial {
    const el = document.createElement('div', { is: 'user-card-social' }) as UserCardSocial;
    setUserProfileCommonValues(user, 'imedium', el);
    return el;
}

/**
 * Creates an inline user profile element containing avatar, username, and winstreak.
 *
 * @param user - The user data object ({@link UserData}).
 * @returns A `UserInline` element populated with the user's avatar, username, and winstreak.
 *
 */
export function createUserInline(user: UserData): UserInline {
    const el = document.createElement('div', { is: 'user-inline' }) as UserInline;
    setUserProfileCommonValues(user, 'iicon', el);
    return el;
}

/**
 * Creates a user profile element containing avatar, username, status, winstreak, biography, and profile age.
 *
 * @param user - The user data object ({@link UserData}).
 * @returns A `UserProfile` element populated with the user's details.
 */
export function createUserProfile(user: UserData): UserProfile {
    const el = document.createElement('div', { is: 'user-profile' }) as UserProfile;
    setUserProfileCommonValues(user, 'ilarge', el);
    el.biography = user.biography;
    el.profileAge = user.since;
    return el;
}
