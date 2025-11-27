import { tournament } from './web-elements/default-values.js';
import { buildUserProfile, userDataFromAPIRes } from './api-responses/user-responses.js';
import { createForm } from './web-elements/forms/helpers.js';
import { createHeading, createNoResult } from './web-elements/typography/helpers.js';
import { createLeaderboard } from './web-elements/statistics/leaderboard.js';
import { createMenu } from './web-elements/navigation/menu-helpers.js';
import { createTabs } from './web-elements/navigation/tabs-helpers.js';
import { farm, ocean, defaultTheme, PongCourt } from './web-elements/game/pong-court.js';
import { farmAssets, Layout, oceanAssets } from './web-elements/layouts/layout.js';
import { localPong, remotePong, userSettingsForm } from './web-elements/forms/default-forms.js';
import { main } from './web-elements/navigation/default-menus.js';
import { pong } from './pong/pong.js';
import { PongUI } from './web-elements/game/game-ui.js';
import { errorMessageFromException, redirectOnError } from './error.js';
import { TournamentBrackets } from './web-elements/game/tournament.js';
import { type Match } from 'path-to-regexp';
import { type TabData } from './web-elements/types-interfaces.js';
import { userStatus, router } from './main.js';
import { loginForm, registrationForm } from './web-elements/forms/default-forms.js';

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
    auth: 'full-screen',
    userSettings: 'page-w-header',
};

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
    prepareLayout(document.body.layoutInstance, 'auth');
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
    if (!status.auth) return redirectOnError('/auth', 'You must be registered to see this page');

    const url = `https://localhost:8443/api/bff/profile/${status.username}?userB=${status.userID}`;

    try {
        prepareLayout(document.body.layoutInstance, 'profile');
        buildUserProfile(await fetch(url));
        updatePageTitle(status.username!);
    } catch (error) {
        console.error(error);
    }
}

export async function renderProfile(param?: Match<Partial<Record<string, string | string[]>>>) {
    console.log('renderProfile');
    if (param && param.params.login && typeof param.params.login === 'string') {
        const status = await userStatus();
        if (!status.auth) return redirectOnError('/auth', 'You must be registered to see this page');

        const login = param.params.login;
        const url = `https://localhost:8443/api/bff/profile/${login}?userB=${status.userID}`;
        try {
            prepareLayout(document.body.layoutInstance, 'profile');
            buildUserProfile(await fetch(url));
            updatePageTitle(login);
        } catch (error) {
            console.error(error);
        }
    } else renderNotFound();
}

export async function renderSettings() {
    console.log('renderSettings');
    const status = await userStatus();
    if (!status.auth) return redirectOnError('/auth', 'You must be registered to see this page');

    const url = `https://localhost:8443/api/bff/tiny-profile/${status.username}`;

    try {
        const raw = await fetch(url);
        const res = await raw.json();
        prepareLayout(document.body.layoutInstance, 'userSettings');
        document.body.layoutInstance?.appendAndCache(
            createForm('settings-form', userSettingsForm, userDataFromAPIRes(res)),
        );
    } catch (error) {
        redirectOnError(router.stepBefore, errorMessageFromException(error));
    }
    updatePageTitle(status.username + 'Settings');
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
    court.theme = farm;
    if (layout) layout.theme = farmAssets;
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
