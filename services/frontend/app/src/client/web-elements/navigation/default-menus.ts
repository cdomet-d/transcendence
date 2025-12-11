import { currentDictionary } from '../forms/language.js';
import type { ButtonData, Dictionary, MenuData, TabData, NavigationLinksData } from '../types-interfaces.js';

export function main(dic: Dictionary): MenuData {
	return {
		id: 'mainNav',
		links: [
			{
				styleButton: true,
				id: 'leaderboard',
				title: dic.titles.leaderboard,
				datalink: 'leaderboard',
				href: '/leaderboard',
				img: null,
			},
			{
				styleButton: true,
				id: 'lobby',
				title: dic.buttons.play,
				datalink: '/lobby-menu',
				href: '/lobby-menu',
				img: null,
			},
			{
				styleButton: true,
				id: 'profile',
				title: dic.buttons.profile,
				datalink: 'profile',
				href: '/me',
				img: null,
			},
		],
	};
}

export function homeLink(dic: Dictionary): MenuData {
	return {
		id: 'backHome',
		links: [
			{
				styleButton: false,
				datalink: 'home',
				href: '/',
				title: dic.titles.home,
				id: 'home',
				img: {
					alt: 'A cute pixel art blob',
					size: 'imedium',
					src: '/public/assets/images/default-avatar.png',
					id: 'homelink',
				},
			},
		],
	};
}

export function logOut(dic: Dictionary): ButtonData {
	return {
		type: 'button',
		id: 'logout',
		content: dic.buttons.logout,
		img: null,
		ariaLabel: '',
		style: 'red',
	};
}

export function logIn(dic: Dictionary): ButtonData {
	return {
		type: 'button',
		id: 'login',
		content: dic.buttons.login,
		img: null,
		ariaLabel: '',
		style: 'green',
	};
}

export function social(dic: Dictionary): MenuData {
	return {
		id: 'social',
		buttons: [
			{
				ariaLabel: 'Add user as friend',
				content: null,
				type: 'button',
				id: 'addFriend',
				img: {
					alt: 'a small pixel art blue blob with a green plus sign',
					id: '',
					size: 'ismall',
					src: '/public/assets/images/add-user.png',
				},
			},
			{
				ariaLabel: 'Remove user from friends',
				content: null,
				type: 'button',
				id: 'removeFriend',
				img: {
					alt: 'a small pixel art blue blob with a red minus sign',
					id: '',
					size: 'ismall',
					src: '/public/assets/images/remove-user.png',
				},
			},
		],

		links: [
			{
				styleButton: true,
				datalink: '/user/settings',
				id: 'settings',
				href: '/user/settings',
				title: dic.titles.settings,
				img: null,
			},
		],
	};
}

export const languageMenu: ButtonData[] = [
    { id: 'English', ariaLabel: 'English', content: 'English', img: null, type: 'button' },
    { id: 'Spanish', ariaLabel: 'Spanish', content: 'Espanol', img: null, type: 'button' },
    { id: 'French', ariaLabel: 'Francais', content: 'Francais', img: null, type: 'button' },
];

export const backgroundMenu: ButtonData[] = [
	{ id: 'farm', ariaLabel: 'Farm pong theme', content: currentDictionary.gameCustom.farm, img: null, type: 'button' },
	{ id: 'forest', ariaLabel: 'Forest pong theme', content: currentDictionary.gameCustom.forest, img: null, type: 'button' },
	{ id: 'underwater', ariaLabel: 'Ocean pong theme', content: currentDictionary.gameCustom.under_water, img: null, type: 'button' },
];

export const userColorsMenu: ButtonData[] = [
	{
		id: '',
		ariaLabel: 'Hexcode selection for azure background.',
		content: '4F9FFF',
		img: null,
		type: 'button',
	},
	{
		id: '',
		ariaLabel: 'Hexcode selection for purple background.',
		content: '5200FF',
		img: null,
		type: 'button',
	},
	{
		id: '',
		ariaLabel: 'Hexcode selection for navy background.',
		content: '000080',
		img: null,
		type: 'button',
	},
	{
		id: '',
		ariaLabel: 'Hexcode selection for green background.',
		content: '98A869',
		img: null,
		type: 'button',
	},
	{
		id: '',
		ariaLabel: 'Hexcode selection for orange background.',
		content: 'BE5103',
		img: null,
		type: 'button',
	},
	{
		id: '',
		ariaLabel: 'Hexcode selection for red background.',
		content: 'CE4257',
		img: null,
		type: 'button',
	},
];

export function profileTabs(dic: Dictionary): TabData[] {
	return [
		{ id: 'friends', content: dic.profile.friends, default: true, panelContent: null },
		{ id: 'history', content: dic.profile.game_history, default: false, panelContent: null },
	];
}

export function lobbyQuickmatchMenu(dic: Dictionary): MenuData {
	return {
		id: 'quickMatchMenu',
		links: [
			{ styleButton: true, id: 'local-quickmatch', title: dic.lobby.local, datalink: '/quick-local-lobby', href: '/quick-local-lobby', img: null },
			{ styleButton: true, id: 'remote-quickmatch', title: dic.lobby.remote, datalink: '/quick-remote-lobby', href: '/quick-remote-lobby', img: null },
		],
	};
}

export function lobbyTournamentMenu(dic: Dictionary): MenuData {
	return {
		id: 'tournamentMenu',
		links: [{ styleButton: true, id: 'tournament', title: dic.lobby.tournament, datalink: '/tournament-lobby', href: '/tournament-lobby', img: null }],
	};
}

export const goHomeData: NavigationLinksData = {
	styleButton: true,
	id: 'backHome',
	title: 'Go home',
	datalink: 'home',
	href: '/',
	img: null,
};
