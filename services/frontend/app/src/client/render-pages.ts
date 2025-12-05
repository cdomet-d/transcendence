import { tournament } from './web-elements/default-values.js';
import {
	buildUserProfile,
	userArrayFromAPIRes,
	userDataFromAPIRes,
} from './api-responses/user-responses.js';
import { createForm } from './web-elements/forms/helpers.js';
import { createHeading, createNoResult } from './web-elements/typography/helpers.js';
import { createLeaderboard } from './web-elements/statistics/leaderboard.js';
import { createMenu } from './web-elements/navigation/menu-helpers.js';
import { createTabs } from './web-elements/navigation/tabs-helpers.js';
import { farm, ocean, defaultTheme, PongCourt } from './web-elements/game/pong-court.js';
import { farmAssets, Layout, oceanAssets } from './web-elements/layouts/layout.js';
import {
	userSettingsForm,
	localPong,
	remotePong,
	pongTournament,
} from './web-elements/forms/default-forms.js';
import {
	lobbyQuickmatchMenu,
	lobbyTournamentMenu,
	main,
} from './web-elements/navigation/default-menus.js';
import { pong, type gameRequest } from './pong/pong.js';
import { PongUI } from './web-elements/game/game-ui.js';
import { errorMessageFromException, exceptionFromResponse, redirectOnError } from './error.js';
import { TournamentBrackets } from './web-elements/game/tournament.js';
import type { Match } from 'path-to-regexp';
import type { navigationLinksData, TabData } from './web-elements/types-interfaces.js';
import { userStatus, router } from './main.js';
import { loginForm, registrationForm } from './web-elements/forms/default-forms.js';
import { wsConnect } from './lobby/wsConnect.front.js';
import type { Menu } from './web-elements/navigation/basemenu.js';
import { createLink } from './web-elements/navigation/buttons-helpers.js';
import type { NavigationLinks } from './web-elements/navigation/links.js';
import { currentDictionary } from './web-elements/forms/language.js';

//TODO: dynamic layout: fullscreen if the user is not logged in, header if he is ?
const layoutPerPage: { [key: string]: string } = {
	bracket: 'full-screen',
	central: 'page-w-header',
	error: 'full-screen',
	game: 'page-w-header',
	home: 'full-screen',
	leaderboard: 'page-w-header',
	quickLobby: 'page-w-header',
	tournamentLobby: 'page-w-header',
	lobbyMenu: 'page-w-header',
	profile: 'page-w-header',
	auth: 'full-screen',
	userSettings: 'page-w-header',
};

function updatePageTitle(newPage: string) {
	document.title = `🌻 BigT - ${newPage} 🌻`;
}

function createWrapper(id: string): HTMLDivElement {
	const el = document.createElement('div');
	el.id = id;
	el.className = 'bg content-h brdr overflow-y-auto overflow-x-hidden justify-start';
	return el;
}

async function prepareLayout(curLayout: Layout | undefined, page: string) {
	if (!layoutPerPage[page]) throw new Error('Requested page is undefined');
	if (!curLayout)
		throw new Error("Something is wrong with the document's layout - page cannot be charged");

	curLayout.clearAll();
	document.body.header?.getLogState();
	if (layoutPerPage[page] === 'full-screen') {
		document.body.header?.classList.add('hidden');
		document.body.header?.setAttribute('hidden', '');
	} else {
		document.body.header?.classList.remove('hidden');
		document.body.header?.removeAttribute('hidden');
	}
}

export function renderNotFound() {
	console.log('renderNotFound');
	const goHomeData: navigationLinksData = {
		styleButton: true,
		id: 'backHome',
		title: 'Go home',
		datalink: 'home',
		href: '/',
		img: null,
	};
	try {
		prepareLayout(document.body.layoutInstance, 'error');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}
	const goHome = createLink(goHomeData, false) as NavigationLinks;
	document.body.layoutInstance!.appendAndCache(createNoResult('dark', 'ifs'), goHome);
	goHome.classList.remove('w-full');
	goHome.classList.add('w-1/4', 'place-self-center');
	updatePageTitle('Not Found');
}

export function renderHome() {
	console.log('RenderHome');
	try {
		prepareLayout(document.body.layoutInstance, 'home');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}
	document.body.layoutInstance!.appendAndCache(
		createHeading('0', 'PONG!'),
		createMenu(main(currentDictionary), 'vertical', true),
	);
	updatePageTitle('Home');
}

export function renderAuth() {
	try {
		prepareLayout(document.body.layoutInstance, 'auth');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}
	const wrapper = createWrapper('authsettings');

	//TODO language
	const authOptions: TabData[] = [
		{
			id: 'login-tab',
			content: 'Login',
			default: true,
			panelContent: createForm('login-form', loginForm(currentDictionary)),
		},
		{
			id: 'registration-tab',
			content: 'Register',
			default: false,
			panelContent: createForm('registration-form', registrationForm(currentDictionary)),
		},
	];
	wrapper.append(createTabs(authOptions));
	document.body.layoutInstance!.appendAndCache(wrapper);
	updatePageTitle('Login | Register');
}

export async function renderLeaderboard() {
	console.log('renderLeaderboard');
	try {
		prepareLayout(document.body.layoutInstance, 'leaderboard');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}

	const url = 'https://localhost:8443/api/bff/leaderboard';

	//TODO: crashes if user is not registered
	try {
		const rawRes = await fetch(url);
		if (rawRes.status === 401)
			return redirectOnError('/auth', 'You must be registered to see this page');
		if (!rawRes.ok) throw await exceptionFromResponse(rawRes);
		const raw = await rawRes.json();

		document.body.layoutInstance!.appendAndCache(
			createHeading('2', 'Leaderboard'),
			createLeaderboard(userArrayFromAPIRes(raw)),
		);
	} catch (error) {
		redirectOnError(router.stepBefore, 'Error: ' + errorMessageFromException(error));
	}

	updatePageTitle('Leaderboard');
}

export async function renderSelf() {
	console.log('renderSelf');

	const status = await userStatus();
	if (!status.auth) return redirectOnError('/auth', 'You must be registered to see this page');

	const url = `https://localhost:8443/api/bff/profile/${status.username}`;

	try {
		prepareLayout(document.body.layoutInstance, 'profile');
		const raw = await fetch(url);
		if (!raw.ok) {
			if (raw.status === 404) return renderNotFound();
			else throw await exceptionFromResponse(raw);
		}
		buildUserProfile(raw);
		updatePageTitle(status.username!);
	} catch (error) {
		redirectOnError(router.stepBefore, 'Error: ' + errorMessageFromException(error));
	}
}

export async function renderProfile(param?: Match<Partial<Record<string, string | string[]>>>) {
	console.log('renderProfile');
	if (param && param.params.login && typeof param.params.login === 'string') {
		const login = param.params.login;
		const url = `https://localhost:8443/api/bff/profile/${login}`;

		try {
			const raw = await fetch(url);
			console.error(raw.status);
			if (!raw.ok) {
				console.error('error', raw.status);
				if (raw.status === 404) return renderNotFound();
				else if (raw.status === 401)
					return redirectOnError('/auth', 'You must be registered to see this page');
				else throw await exceptionFromResponse(raw);
			}
			prepareLayout(document.body.layoutInstance, 'profile');
			buildUserProfile(raw);
			updatePageTitle(login);
		} catch (error) {
			redirectOnError(router.stepBefore, errorMessageFromException(error));
		}
	} else return renderNotFound();
}

export async function renderSettings() {
	console.log('renderSettings');
	const status = await userStatus();
	if (!status.auth) return redirectOnError('/auth', 'You must be registered to see this page');

	const url = `https://localhost:8443/api/bff/tiny-profile/${status.username}`;

	try {
		const raw = await fetch(url);
		if (!raw.ok) {
			console.error('error', raw.status);
			if (raw.status === 404) return renderNotFound();
			else if (raw.status === 401)
				return redirectOnError('/auth', 'You must be registered to see this page');
			else throw await exceptionFromResponse(raw);
		}

		prepareLayout(document.body.layoutInstance, 'userSettings');
		const user = userDataFromAPIRes(raw);
		const form = userSettingsForm(currentDictionary);
		document.body.layoutInstance?.appendAndCache(createForm('settings-form', form, user));
	} catch (error) {
		redirectOnError(router.stepBefore, errorMessageFromException(error));
	}
	updatePageTitle(status.username + 'Settings');
}

//TODO language lobby
export function renderLobbyMenu() {
	console.log('renderLobbyMenu');

	try {
		prepareLayout(document.body.layoutInstance, 'lobbyMenu');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}
	document.body.layoutInstance?.appendAndCache(
		createHeading('1', 'Choose Lobby'),
		createMenu(lobbyQuickmatchMenu(currentDictionary), 'horizontal', true),
		createMenu(lobbyTournamentMenu(currentDictionary), 'vertical', true),
	);
	const quickMen = document.body.layoutInstance?.components.get('quickMatchMenu') as Menu;
	quickMen?.cache.forEach((el) => {
		el.classList.remove('t2');
		el.classList.add('f-l');
	});
	updatePageTitle('Choose Lobby');
}

//TODO: for each lobby: set 'owner' with currently registered user to avoid owner
//  being able to add himself to the game (in the UI - even if it's handled in the pong server)
export function renderQuickLocalLobby() {
	try {
		prepareLayout(document.body.layoutInstance, 'quickLobby');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}
	document.body.layoutInstance?.appendAndCache(
		createForm('local-pong-settings', localPong(currentDictionary)),
	);
	wsConnect('create', 'quickmatch', 'localForm');
}

export function renderQuickRemoteLobby() {
	try {
		prepareLayout(document.body.layoutInstance, 'quickLobby');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}

	document.body.layoutInstance?.appendAndCache(
		createForm('remote-pong-settings', remotePong(currentDictionary)),
	);
	wsConnect('create', 'quickmatch', 'remoteForm');
}

export function renderTournamentLobby() {
	try {
		prepareLayout(document.body.layoutInstance, 'tournamentLobby');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}

	document.body.layoutInstance?.appendAndCache(
		createForm('remote-pong-settings', pongTournament(currentDictionary)),
	);
	wsConnect('create', 'tournament', 'tournamentForm');
}

export function renderGame(
	param?: Match<Partial<Record<string, string | string[]>>>,
	gameRequest?: gameRequest,
) {
	console.log('renderGame');

	if (!gameRequest)
		return redirectOnError('/', "Uh-oh! You can't be there - go join a lobby or something !");
	try {
		prepareLayout(document.body.layoutInstance, 'game');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}

	console.log(gameRequest);
	const court = document.createElement('div', { is: 'pong-court' }) as PongCourt;
	const ui = document.createElement('div', { is: 'pong-ui' }) as PongUI;

	//TODO: set playerNames from game-manager object
	ui.player1.innerText = 'CrimeGoose';
	ui.player2.innerText = 'WinnerWolf';

	const layout = document.body.layoutInstance;
	// TODO: set pong-court theme from game-manager object
	court.theme = farm;
	if (layout) layout.theme = farmAssets;
	document.body.layoutInstance?.appendAndCache(ui, court);

	// pong({ userID: 1, gameID: "1", remote: false }, court.ctx, ui);
	if (gameRequest === undefined) {
		console.log('GameRequest =>', gameRequest);
		// TODO Show explicit error in UI
		return;
	}
	pong(gameRequest!, court.ctx, ui);
}

export function renderBracket() {
	console.log('renderBracket');
	try {
		prepareLayout(document.body.layoutInstance, 'bracket');
	} catch (error) {
		console.error(errorMessageFromException(error));
	}

	const bracket = document.createElement('div', {
		is: 'tournament-bracket',
	}) as TournamentBrackets;
	if (bracket) bracket.players = tournament;
	document.body.layoutInstance?.appendAndCache(bracket);
}
