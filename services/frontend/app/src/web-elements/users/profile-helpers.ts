import type { UserData } from '../types-interfaces.js';
import { UserProfile, UserCardSocial, UserInline } from './profile.js';
/**
 * Creates a user card element with avatar, username, and social menu.
 *
 * @param socialBtns - Array of social button metadata. ({@link buttonData})
 * @param user - The user data object ({@link UserData}).
 * @returns A `UserCardSocial` element populated with user info and social buttons.
 */
export function createUserCardSocial(user: UserData): UserCardSocial {
    const el = document.createElement('div', { is: 'user-card-social' }) as UserCardSocial;
    const avatar = { ...user.avatar };
    avatar.size = 'imedium';
    el.profileId = user.id;
    el.avatar = avatar;
    el.color = user.profileColor;
    el.username = user.username;
    el.status = user.status;
    el.profileView = user.relation;
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
    const avatar = { ...user.avatar };
    avatar.size = 'iicon';
    el.profileId = user.id;
    el.avatar = avatar;
    el.username = user.username;
    el.status = user.status;
    el.winstreak = user.winstreak;
    el.color = user.profileColor;
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
    const avatar = { ...user.avatar };
    avatar.size = 'ilarge';
    el.profileId = user.id;
    el.avatar = avatar;
    el.username = user.username;
    el.status = user.status;
    el.winstreak = user.winstreak;
    el.profileView = user.relation;
    el.biography = user.biography;
    el.profileAge = user.since;
    return el;
}
