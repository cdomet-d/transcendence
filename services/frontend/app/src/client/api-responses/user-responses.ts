import type { UserData, ImgData, ProfileView } from '../web-elements/types-interfaces';
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

function setStatus(n: number): boolean {
	return n == 1 ? false : true;
}

function setAvatar(a: string): ImgData {
	if (!a) {
		const defaultAvatar: ImgData = { alt: 'The user\'s profile picture', id: 'user-avatar', size: 'ixl', src: '/public/assets/images/pink-avatar.png' };
		return defaultAvatar;
	} else {
		const userSetProfilePicture: ImgData = { id: 'user-pp', alt: 'User-set profile picture', src: a, size: 'ixl' };
		return userSetProfilePicture;
	}
}

function setBiography(b: string): string {
	if (b) return b;
	const bio = "But in the end it's only a passing thing, this shadow; even darkness must pass. ― J.R.R. Tolkien";
	return bio;
}

export function userDataFromAPIRes(responseObject: any): UserData {
	if (!responseObject || typeof responseObject !== 'object' || responseObject instanceof Error) redirectOnError(router.stepBefore, 'Something bad happened :(');
	const user: UserData = {
		winstreak: responseObject.winstreak,
		avatar: setAvatar(responseObject.avatar),
		biography: setBiography(responseObject.biography),
		id: responseObject.userID,
		language: responseObject.lang,
		profileColor: responseObject.profileColor,
		relation: responseObject.relation as ProfileView,
		since: UTCtoDays(responseObject.since),
		status: setStatus(responseObject.status),
		username: responseObject.username,
	};
	if ('totalWins' in responseObject) user.totalWins = responseObject.totalWins.toString();
	if ('totalLosses' in responseObject) user.totalLosses = responseObject.totalLosses.toString();
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
	userProfileElem.panelContent = createMatchHistoryPanel(MatchOutcomeArrayFromAPIRes(rawProfile.matches));
	return userProfileElem;
}
