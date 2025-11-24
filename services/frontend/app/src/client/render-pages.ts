import { createHeading, createNoResult } from './web-elements/typography/helpers.js';
import { createLeaderboard } from './web-elements/statistics/leaderboard.js';
import { createMenu } from './web-elements/navigation/menu-helpers.js';
import { main } from './web-elements/navigation/default-menus.js';
import { farmAssets, Layout, oceanAssets } from './web-elements/layouts/layout.js';
import { ProfileWithTabs, user } from './web-elements/users/user-profile-containers.js';
import { type Match } from 'path-to-regexp';
import { createTabs } from './web-elements/navigation/tabs-helpers.js';
import { type TabData } from './web-elements/types-interfaces.js';
import { createForm } from './web-elements/forms/helpers.js';
import {
    localPong,
    registrationForm,
    loginForm,
    remotePong,
    userSettingsForm,
} from './web-elements/forms/default-forms.js';
import { tournament } from './web-elements/default-values.js';
import { farm, ocean, defaultTheme, PongCourt } from './web-elements/game/pong-court.js';
import { pong } from './pong/pong.js';
import { TournamentBrackets } from './web-elements/game/tournament.js';
import { PongUI } from './web-elements/game/game-ui.js';
import { userStatus } from './main.js';
import { router } from './main.js';

//TODO: dynamic layout: fullscreen if the user is not logged in, header if he is ?
const layoutPerPage: { [key: string]: string } = {
    bracket: 'full-screen',
    central: 'page-w-header',
    error: 'full-screen',
    game: 'page-w-header',
    home: 'full-screen',
    leaderboard: 'page-w-header',
    lobby: 'page-w-header',
    profile: 'page-w-header',
    regitration: 'full-screen',
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

function prepareLayout(curLayout: Layout | undefined, page: string) {
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
    prepareLayout(document.body.layoutInstance, 'error');
    document.body.layoutInstance!.appendAndCache(createNoResult('dark', 'ifs'));
    updatePageTitle('Not Found');
}

export function renderHome() {
    console.log('RenderHome');
    prepareLayout(document.body.layoutInstance, 'home');
    document.body.layoutInstance!.appendAndCache(
        createHeading('0', 'PONG!'),
        createMenu(main, 'vertical', true),
    );
    updatePageTitle('Home');
}

export function renderAuth() {
    prepareLayout(document.body.layoutInstance, 'home');
    const authOptions: TabData[] = [
        {
            id: 'login-tab',
            content: 'Login',
            default: true,
            panelContent: createForm('login-form', loginForm),
        },
        {
            id: 'registration-tab',
            content: 'Register',
            default: false,
            panelContent: createForm('registration-form', registrationForm),
        },
    ];
    const wrapper = createWrapper('authsettings');
    wrapper.append(createTabs(authOptions));
    document.body.layoutInstance!.appendAndCache(wrapper);
    updatePageTitle('Login | Register');
}

export function renderLeaderboard() {
    console.log('renderLeaderboard');
    prepareLayout(document.body.layoutInstance, 'leaderboard');
    document.body.layoutInstance!.appendAndCache(
        createHeading('1', 'Leaderboard'),
        createLeaderboard([]),
    );
    updatePageTitle('Leaderboard');
}

export async function renderSelf() {
    console.log('renderSelf');

    const status = await userStatus();
    console.log(status.auth, status.userID, status.username);
    if (!status.auth) {
        router.loadRoute('/auth', true);
        return;
    }
	// const url = `https://localhost:8443/api/bff/profile/${status.username}`

	try {
		// const reply = await fetch(url)
		// const profile = reply.json();
		// console.log(profile);
		prepareLayout(document.body.layoutInstance, 'profile');
		document.body.layoutInstance?.appendAndCache(
			document.createElement('div', { is: 'profile-page' }) as ProfileWithTabs,
		);
		const pInstance = document.body.layoutInstance?.components.get(
			'user-profile',
		) as ProfileWithTabs;
		pInstance.profile = user;
   		updatePageTitle(status.username!);
	} catch (error) {
		console.error(error)
	}
}

export async function renderProfile(param?: Match<Partial<Record<string, string | string[]>>>) {
    console.log('renderProfile');
    if (param) {
        const login = param.params.login;
        // const req: RequestInit = { method: 'get' };

        //TODO: API call with login here to fetch user data
        // await fetch(`https://localhost:8443/api/bff/profile/${login}/profile`, req);
        prepareLayout(document.body.layoutInstance, 'profile');
        document.body.layoutInstance?.appendAndCache(
            document.createElement('div', { is: 'profile-page' }) as ProfileWithTabs,
        );
        const pInstance = document.body.layoutInstance?.components.get(
            'user-profile',
        ) as ProfileWithTabs;
        pInstance.profile = user;
        updatePageTitle('User ' + login);
    } else renderNotFound();
}

export function renderSettings() {
    console.log('renderSettings');
    //TODO: API call with login here to fetch user data
    prepareLayout(document.body.layoutInstance, 'profile');
    document.body.layoutInstance?.appendAndCache(
        createForm('settings-form', userSettingsForm, user),
    );
    updatePageTitle('Settings');
}

export function renderLobby() {
    prepareLayout(document.body.layoutInstance, 'lobby');
    const pongOptions: TabData[] = [
        {
            id: 'pong-local',
            content: 'Play local',
            default: false,
            panelContent: createForm('local-pong-settings', localPong),
        },
        {
            id: 'pong-remote',
            content: 'Play remote',
            default: true,
            panelContent: createForm('remote-pong-settings', remotePong),
        },
    ];
    const wrapper = createWrapper('pongsettings');
    wrapper.append(createTabs(pongOptions));
    document.body.layoutInstance?.appendAndCache(wrapper);
}

export function renderGame() {
    console.log('renderGame');
    prepareLayout(document.body.layoutInstance, 'game');

    const court = document.createElement('div', { is: 'pong-court' }) as PongCourt;
    const ui = document.createElement('div', { is: 'pong-ui' }) as PongUI;

    //TODO: set playerNames from game-manager object
    ui.player1.innerText = 'CrimeGoose';
    ui.player2.innerText = 'WinnerWolf';

    const layout = document.body.layoutInstance;
    // TODO: set pong-court theme from game-manager object
    court.theme = ocean;
    if (layout) layout.theme = oceanAssets;
    document.body.layoutInstance?.appendAndCache(ui, court);

    pong({ userID: 1, gameID: 1, remote: false }, court.ctx, ui);
}

export function renderBracket() {
    console.log('renderBracket');
    prepareLayout(document.body.layoutInstance, 'bracket');

    const bracket = document.createElement('div', {
        is: 'tournament-bracket',
    }) as TournamentBrackets;
    if (bracket) bracket.players = tournament;
    document.body.layoutInstance?.appendAndCache(bracket);
}
