import type { UserData, ImgData, ProfileView } from '../web-elements/types-interfaces';
import { defaultAvatar } from '../web-elements/default-values';
import { ProfilePage } from '../web-elements/users/user-profile-containers';
import { createFriendsPanel, createMatchHistoryPanel } from '../web-elements/users/profile-helpers';
import { exceptionFromResponse, redirectOnError } from '../error';
import { router } from '../main';
import { MatchOutcomeArrayFromAPIRes } from './matches';

function UTCtoDays(since: string): string {
    const today = new Date();
    const date = new Date(since);
    if (isNaN(date.getTime())) return '0';

    const sDiff = today.getTime() - date.getTime();
    const dDiff = sDiff / (1000 * 60 * 60 * 24);
    const res = Math.round(dDiff);
    return res.toString();
}

function setColor(c: string): string {
    return c.startsWith('bg-') ? c : 'bg-CE4257';
}

function setStatus(n: number): boolean {
    return n == 1 ? false : true;
}

function setAvatar(a: string): ImgData {
    let uAvatar: ImgData = { src: '', alt: '', id: 'user-profile-picture', size: 'ilarge' };
    if (!a || a === 'avatar1.png') uAvatar = defaultAvatar;
    else uAvatar.src = a;
    return uAvatar;
}

function setBiography(b: string): string {
    if (b) return b;
    const bio =
        "What a wee little part of a person's life are his acts and his words!\
	 His real life is led in his head, and is known to none but himself. \
	 All day long, the mill of his brain is grinding, and his thoughts, \
	 not those of other things, are his history. These are his life, and they\
	 are not written. Everyday would make a whole book of 80,000 words -- \
	 365 books a year. Biographies are but the clothes and buttons of the man \
	 -- the biography of the man himself cannot be written. ― Mark Twain ";
    return bio;
}

export function userDataFromAPIRes(responseObject: any): UserData {
    if (!responseObject || typeof responseObject !== 'object' || responseObject instanceof Error)
        redirectOnError(router.stepBefore, 'Something bad happened :(');
    const user: UserData = {
        // winstreak: responseObject.winstreak,
        winstreak: '9',
        avatar: setAvatar(responseObject.avatar),
        biography: setBiography(responseObject.biography),
        id: responseObject.userID,
        language: responseObject.lang,
        profileColor: setColor(responseObject.profileColor),
        relation: responseObject.relation as ProfileView,
        since: UTCtoDays(responseObject.since),
        status: setStatus(responseObject.status),
        username: responseObject.username,
    };
    return user;
}

export function userArrayFromAPIRes(responseObject: any): UserData[] {
    let userArray: UserData[] = [];
    responseObject.forEach((el: any) => {
        const u = userDataFromAPIRes(el);
        userArray.push(u);
    });

    return userArray;
}

export async function buildUserProfile(response: Response): Promise<ProfilePage> {
    if (!response.ok) throw await exceptionFromResponse(response);
    const rawProfile = await response.json();
    const userProfileElem = document.createElement('div', { is: 'profile-page' }) as ProfilePage;

    document.body.layoutInstance?.appendAndCache(userProfileElem);
    userProfileElem.profile = userDataFromAPIRes(rawProfile.userData);
    userProfileElem.panelContent = createFriendsPanel(userArrayFromAPIRes(rawProfile.friends));
    userProfileElem.panelContent = createMatchHistoryPanel(
        MatchOutcomeArrayFromAPIRes(rawProfile.matches),
    );
    return userProfileElem;
}
