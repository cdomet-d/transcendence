import { buildUserProfile, userArrayFromAPIRes, userDataFromAPIRes } from './api-responses/user-responses.js';
import { createForm } from './web-elements/forms/helpers.js';
import { createHeading, createNoResult } from './web-elements/typography/helpers.js';
import { createLeaderboard } from './web-elements/statistics/leaderboard.js';
import { createMenu } from './web-elements/navigation/menu-helpers.js';
import { createTabs } from './web-elements/navigation/tabs-helpers.js';
import { farm, ocean, defaultTheme, PongCourt } from './web-elements/game/pong-court.js';
import { farmAssets, Layout, oceanAssets } from './web-elements/layouts/layout.js';
import { userSettingsForm, localPong, remotePong, pongTournament } from './web-elements/forms/default-forms.js';
import { lobbyQuickmatchMenu, lobbyTournamentMenu, main, goHomeData } from './web-elements/navigation/default-menus.js';
import { pong, type gameRequest } from './pong/pong.js';
import { PongUI } from './web-elements/game/game-ui.js';
import { errorMessageFromException, exceptionFromResponse, redirectOnError } from './error.js';
import type { Match } from 'path-to-regexp';
import type { pongTheme, TabData, ImgData } from './web-elements/types-interfaces.js';
import { router, type userStatusInfo } from './main.js';
import { loginForm, registrationForm } from './web-elements/forms/default-forms.js';
import { wsConnect } from './lobby/wsConnect.front.js';
import type { Menu } from './web-elements/navigation/basemenu.js';
import { createLink } from './web-elements/navigation/buttons-helpers.js';
import { NavigationLinks } from './web-elements/navigation/links.js';
import { currentDictionary } from './web-elements/forms/language.js';
import type { LocalPongSettings, RemotePongSettings } from './web-elements/forms/pong-settings.js';
import { createPrivacy } from './web-elements/users/privacy.js';
import { AriaLiveAnnouncer } from 'aria-announcer-js';

export const announcer = new AriaLiveAnnouncer({politeness: 'polite'});

const layoutPerPage: { [key: string]: string } = {
	bracket: 'full-screen',
	error: 'full-screen',
	game: 'page-w-header',
	home: 'full-screen',
	leaderboard: 'page-w-header',
	quickLobby: 'page-w-header',
	tournamentLobby: 'page-w-header',
	lobbyMenu: 'page-w-header',
	profile: 'page-w-header',
	auth: 'full-screen',
	settings: 'page-w-header',
	privacy: 'page-w-header',
};

const requireAuth: { [key: string]: boolean } = {
	bracket: true,
	error: false,
	game: true,
	home: false,
	leaderboard: true,
	quickLobby: true,
	tournamentLobby: true,
	lobbyMenu: true,
	profile: true,
	auth: false,
	settings: true,
};

function updatePageTitle(newPage: string) {
	document.title = `🌻 BigT - ${newPage} 🌻`;
}

export function createWrapper(id: string): HTMLDivElement {
	const el = document.createElement('div');
	el.id = id;
	el.className = 'bg content-h brdr overflow-y-auto overflow-x-hidden justify-start';
	return el;
}

function toggleHeader(page: string) {
	if (layoutPerPage[page] === 'full-screen') {
		document.body.header?.classList.add('hidden');
		document.body.header?.setAttribute('hidden', 'true');
	} else {
		document.body.header?.classList.remove('hidden');
		document.body.header?.removeAttribute('hidden');
	}
	const grpd = document.body.footer?.children;
	if (!grpd) return;
	for (const el of grpd) {
		if (el instanceof NavigationLinks) {
			el.info.title = currentDictionary.buttons.privacy;
			el.render();
		}
	}
}

async function prepareLayout(curLayout: Layout | undefined, page: string): Promise<userStatusInfo | null> {
	if (!layoutPerPage[page]) {
		return redirectOnError('/404', `Requested page (${page}) is undefined`), null;
	}
	if (!curLayout) return redirectOnError('/404', 'Failed to load DOM'), null;

	const user = await document.body.header?.getLogState();
	if (!user) return redirectOnError('/404', 'Redirected: Failed to recover user'), null;
	curLayout.clearAll();

	if (!user.auth && requireAuth[page]) {
		return redirectOnError('/auth', currentDictionary.error.redirection), null;
	}
	toggleHeader(page);
	return user;
}

export async function renderNotFound() {
	if (document.body.layoutInstance) document.body.layoutInstance.clearAll();
	document.body.header?.classList.add('hidden');
	document.body.header?.setAttribute('hidden', '');
	const goHome = createLink(goHomeData, false) as NavigationLinks;
	const noResult = createNoResult('dark', 'i2xl');
	noResult.setErrorMessage(currentDictionary.error.page404);
	console.log('PAGE404', currentDictionary.error.page404);
	document.body.layoutInstance!.appendAndCache(noResult, goHome);
	goHome.classList.remove('w-full');
	goHome.classList.add('w-1/4', 'place-self-center');
	updatePageTitle('Not Found');
	announcer.announce('Loaded page: not found', 'polite')
}

export async function renderHome() {
	if (!(await prepareLayout(document.body.layoutInstance, 'home'))) return;
	document.body.layoutInstance!.appendAndCache(createHeading('0', 'PONG!'), createMenu(main(), 'vertical', true));
	updatePageTitle('Home');
	announcer.announce('Loaded page: Home', 'polite')
}

export async function renderAuth() {
	if (!(await prepareLayout(document.body.layoutInstance, 'auth'))) return;
	const wrapper = createWrapper('authsettings');

	const authOptions: TabData[] = [
		{
			id: 'login-tab',
			content: currentDictionary.titles.login,
			default: true,
			panelContent: createForm('login-form', loginForm()),
		},
		{
			id: 'registration-tab',
			content: currentDictionary.titles.register,
			default: false,
			panelContent: createForm('registration-form', registrationForm()),
		},
	];
	wrapper.append(createTabs(authOptions));
	document.body.layoutInstance!.appendAndCache(wrapper);
	updatePageTitle('Login | Register');
	announcer.announce('Loaded page: Authentication', 'polite')
}

export async function renderLeaderboard() {
	if (!(await prepareLayout(document.body.layoutInstance, 'leaderboard'))) return;

	const url = `https://${API_URL}:8443/api/bff/leaderboard`;

	try {
		const rawRes = await fetch(url, { credentials: 'include' });
		if (!rawRes.ok) throw await exceptionFromResponse(rawRes);
		const raw = await rawRes.json();
		const wrapper = createWrapper('learderboard');
		wrapper.append(createHeading('2', currentDictionary.titles.leaderboard), createLeaderboard(userArrayFromAPIRes(raw)));
		document.body.layoutInstance!.appendAndCache(wrapper);
	} catch (error) {
		console.error(errorMessageFromException(error));
		redirectOnError('/', 'Error: ' + errorMessageFromException(error));
	}

	updatePageTitle('Leaderboard');
	announcer.announce('Loaded page: Leaderboard', 'polite')
}

export async function renderSelf() {
	const status = await prepareLayout(document.body.layoutInstance, 'profile');
	if (!status) return;

	const url = `https://${API_URL}:8443/api/bff/profile/${status.username}`;
	try {
		const raw = await fetch(url, { credentials: 'include' });
		if (!raw.ok) {
			if (raw.status === 404) return redirectOnError('/404', currentDictionary.error.no_user);
			else throw await exceptionFromResponse(raw);
		}
		buildUserProfile(raw);
		updatePageTitle(status.username!);
		announcer.announce(`Loaded page: ${status.username} profile page`, 'polite')
	} catch (error) {
		console.error(errorMessageFromException(error));
		redirectOnError(router.stepBefore, 'Error: ' + errorMessageFromException(error));
	}
}

export async function renderProfile(param?: Match<Partial<Record<string, string | string[]>>>) {
	if (!(await prepareLayout(document.body.layoutInstance, 'profile'))) return;
	if (!param || !param.params.login || typeof param.params.login !== 'string') return redirectOnError('/404', currentDictionary.error.no_user);
	const login = param.params.login;
	const url = `https://${API_URL}:8443/api/bff/profile/${login}`;

	try {
		const raw = await fetch(url, { credentials: 'include' });
		if (!raw.ok) {
			if (raw.status === 404) return redirectOnError('/404', currentDictionary.error.no_user);
			else throw await exceptionFromResponse(raw);
		}
		buildUserProfile(raw);
		updatePageTitle(login);
		announcer.announce(`Loaded page: ${login} profile page`, 'polite')
	} catch (error) {
		console.error(errorMessageFromException(error));
		redirectOnError(router.stepBefore, errorMessageFromException(error));
	}
}

export async function renderSettings() {
	const status = await prepareLayout(document.body.layoutInstance, 'settings');
	if (!status) return;

	const url = `https://${API_URL}:8443/api/bff/tiny-profile/${status.username}`;
	try {
		const raw = await fetch(url, { credentials: 'include' });
		if (!raw.ok) {
			if (raw.status === 404) return redirectOnError('/404', currentDictionary.error.no_user);
			else throw await exceptionFromResponse(raw);
		}
		const data = await raw.json();
		const user = userDataFromAPIRes(data);
		document.body.layoutInstance?.appendAndCache(createForm('settings-form', userSettingsForm(user), user));
		updatePageTitle(status.username + 'Settings');
		announcer.announce(`Loaded page: settings for ${status.username}`, 'polite')
	} catch (error) {
		console.error(errorMessageFromException(error));
		redirectOnError(router.stepBefore, errorMessageFromException(error));
	}
}

export async function renderLobbyMenu() {
	if (!(await prepareLayout(document.body.layoutInstance, 'lobbyMenu'))) return;
	document.body.layoutInstance?.appendAndCache(
		createHeading('1', currentDictionary.titles.choose_lobby),
		createMenu(lobbyQuickmatchMenu(), 'horizontal', true),
		createMenu(lobbyTournamentMenu(), 'vertical', true),
	);
	const quickMen = document.body.layoutInstance?.components.get('quickMatchMenu') as Menu;
	quickMen?.cache.forEach((el) => {
		el.classList.remove('t2');
		el.classList.add('f-l');
	});
	updatePageTitle('Choose Lobby');
	announcer.announce(`Loaded page: Menu lobby`, 'polite')
}

//TODO: for each lobby: set 'owner' with currently registered user to avoid owner
//  being able to add himself to the game (in the UI - even if it's handled in the pong server)
export async function renderQuickLocalLobby() {
	const status = await prepareLayout(document.body.layoutInstance, 'quickLobby');
	if (!status) return JSON.stringify({ event: 'BAD_USER_TOKEN' });

	const form: LocalPongSettings = createForm('local-pong-settings', localPong());
	document.body.layoutInstance?.appendAndCache(form);
	form.format = 'quickmatch';
	form.formInstance = 'localForm';
	form.classList.remove('h-full');
	form.classList.add('content-h', 'bg', 'brdr', 'pad-s');
	wsConnect('create', 'quickmatch', 'localForm', undefined, undefined, undefined, form);
	updatePageTitle('Local lobby settings');
	announcer.announce(`Loaded page: Local lobby settings`, 'polite')
}

export async function renderQuickRemoteLobby(param?: Match<Partial<Record<string, string | string[]>>>, gameRequest?: gameRequest, action?: string, whiteListUsernames?: string[]) {
	const status = await prepareLayout(document.body.layoutInstance, 'quickLobby');
	if (!status) return JSON.stringify({ event: 'BAD_USER_TOKEN' });

	const form: RemotePongSettings = createForm('remote-pong-settings', remotePong());
	form.format = 'quickmatch';
	form.formInstance = 'remoteForm';
	document.body.layoutInstance?.appendAndCache(form);
	form.classList.remove('h-full');
	form.classList.add('content-h', 'bg', 'brdr', 'pad-s');
	if (action === 'invitee') {
		form.disableSearchBar();
		form.displayUpdatedGuests(whiteListUsernames!);
	}
	if (action === undefined) {
		action = 'create';
		form.owner = status.username!;
	}
	wsConnect(action!, 'quickmatch', 'remoteForm', undefined, undefined, undefined, form);
	updatePageTitle('Remote lobby');
	announcer.announce(`Loaded page: Remote lobby settings`, 'polite')
}

export async function renderTournamentLobby(param?: Match<Partial<Record<string, string | string[]>>>, gameRequest?: gameRequest, action?: string, whiteListUsernames?: string[]) {
	const status = await prepareLayout(document.body.layoutInstance, 'tournamentLobby');
	if (!status) return JSON.stringify({ event: 'BAD_USER_TOKEN' });

	const form: RemotePongSettings = createForm('remote-pong-settings', pongTournament());
	document.body.layoutInstance?.appendAndCache(form);
	form.owner = status.username!;
	form.format = 'tournament';
	form.formInstance = 'remoteForm';
	form.classList.remove('h-full');
	form.classList.add('content-h', 'bg', 'brdr', 'pad-s');

	if (action === 'invitee') {
		form.disableSearchBar();
		form.displayUpdatedGuests(whiteListUsernames!);
	} 
	if (action === undefined) {
		action = 'create';
		form.owner = status.username!;
	}
	wsConnect(action!, 'tournament', 'remoteForm', undefined, undefined, undefined, form);
	updatePageTitle('Tournament lobby');
	announcer.announce(`Loaded page: Tournament lobby settings`, 'polite')
}
export async function renderGame(param?: Match<Partial<Record<string, string | string[]>>>, gameRequest?: gameRequest, action?: string, whiteListUsernames?: string[], lobbyWS?: WebSocket) {
	const status = await prepareLayout(document.body.layoutInstance, 'game');
	if (!status) return JSON.stringify({ event: 'BAD_USER_TOKEN' });
	if (!gameRequest) {
		console.error('GameRequest =>', gameRequest);
		return redirectOnError('/', currentDictionary.error.join_lobby);
	}
	const court = document.createElement('div', { is: 'pong-court' }) as PongCourt;
	const ui = document.createElement('div', { is: 'pong-ui' }) as PongUI;

	ui.player1.innerText = status.username!;
	ui.player2.innerText = gameRequest.opponent;
	const layout = document.body.layoutInstance;
	const background: [pongTheme, ImgData[]] = getGameBackground(gameRequest.gameSettings.background);
	court.theme = background[0];
	court.lobbySocket = lobbyWS!;
	if (layout) layout.theme = background[1];
	document.body.layoutInstance?.appendAndCache(ui, court);
	pong(gameRequest!, court, ui);
	updatePageTitle('Game!');
	announcer.announce(`Loaded page: Pong game`, 'polite')
}

function getGameBackground(background?: string): [pongTheme, ImgData[]] {
	if (background === 'farm') return [farm, farmAssets];
	if (background === 'ocean') return [ocean, oceanAssets];
	return [defaultTheme, []];
}

export async function renderPrivacy() {
	if (!(await prepareLayout(document.body.layoutInstance, 'privacy'))) return;

	try {
		const privacy = createPrivacy();
		privacy.tabIndex = 1;
		document.body.layoutInstance!.appendAndCache(privacy);
	} catch (error) {
		redirectOnError(router.stepBefore, 'Error: ' + errorMessageFromException(error));
	}
	updatePageTitle('Privacy');
	announcer.announce(`Loaded page: Privacy policy page`, 'polite')
}
