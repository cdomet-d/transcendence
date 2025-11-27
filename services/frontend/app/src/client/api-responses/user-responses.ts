import type { UserData, ImgData, ProfileView } from '../web-elements/types-interfaces';
import { defaultAvatar } from '../web-elements/default-values';

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
    let uAvatar: ImgData = {
        src: '',
        alt: '',
        id: 'user-profile-picture',
        size: 'ilarge',
    };
    if (!a || a === 'avatar1.png') uAvatar = defaultAvatar;
    else uAvatar.src = a;
    return uAvatar;
}

export function userDataFromAPIRes(responseObject: any): UserData {
    const user: UserData = {
        // winstreak: responseObject.winstreak,
        avatar: setAvatar(responseObject.avatar),
        biography: responseObject.biography,
        id: responseObject.userID,
        language: responseObject.lang,
        profileColor: setColor(responseObject.profileColor),
        relation: responseObject.relation as ProfileView,
        since: UTCtoDays(responseObject.since),
        status: setStatus(responseObject.status),
        username: responseObject.username,
        winstreak: '9',
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
