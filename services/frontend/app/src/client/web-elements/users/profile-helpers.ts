import { defaultAvatar } from '../default-values.js';
import type { ImgData, ProfileView, Size, UserData } from '../types-interfaces.js';
import { UserProfile, UserCardSocial, UserInline } from './profile.js';

function UTCtoDays(since: string): string {
    const today = new Date();
    const date = new Date(since);
    const sDiff = today.getTime() - date.getTime();
    const dDiff = sDiff / (1000 * 60 * 60 * 24);

    return dDiff.toString();
}
export function userDataFromResponse(response: any): UserData {
    let uAvatar: ImgData = {
        src: '',
        alt: '',
        id: 'user-profile-picture',
        size: 'ilarge',
    };

    if (!response.avatar) uAvatar = defaultAvatar;
    else uAvatar.src = response.avatar;

    let status: boolean;

    response.status === 1 ? (status = false) : (status = true);

    const user: UserData = {
        avatar: uAvatar,
        biography: response.biography,
        id: response.userID.toString(),
        language: response.lang.toString(),
        profileColor: response.profileColor.toString(),
        relation: response.relation as ProfileView,
        since: UTCtoDays(response.since),
        status: status,
        username: response.username.toString(),
        // winstreak: response.winstreak.toString(),
        winstreak: '9',
    };
    return user;
}

export function setAvatar(
    size: Size,
    el: UserProfile | UserCardSocial | UserInline,
    av?: ImgData | null,
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
    setAvatar(size, el, user.avatar);
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
