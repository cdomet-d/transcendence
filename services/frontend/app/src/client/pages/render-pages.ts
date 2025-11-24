import { createHeading, createNoResult } from '../web-elements/typography/helpers.js';
import { createLeaderboard } from '../web-elements/matches/leaderboard.js';
import { createMenu } from '../web-elements/navigation/menu-helpers.js';
import { main, lobbyMenu } from '../web-elements/navigation/default-menus.js';
import { Layout } from '../web-elements/layouts/layout.js';
import { ProfileWithTabs } from '../web-elements/users/user-profile-containers.js';
import { type Match } from 'path-to-regexp';
import { createTabs } from '../web-elements/navigation/tabs-helpers.js';
import { type TabData } from '../web-elements/types-interfaces.js';
import { createForm } from '../web-elements/forms/helpers.js';
import {
    localPong,
    registrationForm,
    loginForm,
    remotePong,
    userSettingsForm,
    pongTournament,
} from '../web-elements/forms/default-forms.js';
import { user } from '../web-elements/default-values.js';
import { wsConnect } from '../scripts/lobby/wsConnect.js';

//TODO: dynamic layout: fullscreen if the user is not logged in, header if he is ?
const layoutPerPage: { [key: string]: string } = {
    central: 'page-w-header',
    error: 'full-screen',
    game: 'full-screen',
    home: 'full-screen',
    leaderboard: 'page-w-header',
    quickLobby: 'page-w-header',
    tournamentLobby: 'page-w-header',
    lobbyMenu: 'page-w-header',
    profile: 'page-w-header',
    registration: 'full-screen',
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
    prepareLayout(document.body.layoutInstance, 'registration');
    const authOptions: TabData[] = [
        {
            id: 'login-tab',
            content: 'Login',
            default: false,
            panelContent: createForm('login-form', loginForm),
        },
        {
            id: 'registration-tab',
            content: 'Register',
            default: true,
            panelContent: createForm('registration-form', registrationForm),
        },
    ];
    const wrapper = createWrapper('authsettings');
    wrapper.append(createTabs(authOptions));
    document.body.layoutInstance!.appendAndCache(wrapper);
    updatePageTitle('Login/Register');
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

export async function renderProfile(param?: Match<Partial<Record<string, string | string[]>>>) {
    console.log('renderProfile');
    if (param) {
        const login = param.params.login;
        const req: RequestInit = { method: 'get' };

        //TODO: API call with login here to fetch user data
        await fetch(`https://localhost:8443/api/bff/users/${login}/profile`, req); // 404 (NGINX or BFF does not recognise route)
        prepareLayout(document.body.layoutInstance, 'profile');
        document.body.layoutInstance?.appendAndCache(
            document.createElement('div', { is: 'profile-page' }) as ProfileWithTabs,
        );
        const profile = document.body.layoutInstance?.components.get('user-profile') as ProfileWithTabs;
        profile.profile = user;
        updatePageTitle('User ' + login);
    } else {
        console.log('No parameter, which should not happen');
        renderNotFound();
    }
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

export function renderLobbyMenu() {
    console.log('renderLobbyMenu');
    prepareLayout(document.body.layoutInstance, 'lobbyMenu');
    document.body.layoutInstance!.appendAndCache(
        createHeading('1', 'Choose Lobby'),
        createMenu(lobbyMenu, 'horizontal', true),
        // createMenu(lobbyMenu, 'vertical', true),
    );
    updatePageTitle('Choose Lobby');
}

export function renderQuickLobby() {
    prepareLayout(document.body.layoutInstance, 'quickLobby');
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
    wsConnect('create', 'quickmatch');

    // const quickmatch = document.body.layoutInstance?.components.get('local-quickmatch');
    const quickmatch = document.body.layoutInstance?.components.get('pongsettings');
    console.log(quickmatch);
}

export function renderTournamentLobby() {
    prepareLayout(document.body.layoutInstance, 'tournamentLobby');
    const pongOptions: TabData[] = [
        {
            id: 'pong-tournament',
            content: '',
            default: true,
            panelContent: createForm('remote-pong-settings', pongTournament),
        },
    ];
    const wrapper = createWrapper('pongsettings');
    wrapper.append(createTabs(pongOptions));
    document.body.layoutInstance?.appendAndCache(wrapper);
    wsConnect('create', 'tournament');

    const tournament = document.body.layoutInstance?.components.get('pongsettings');
    console.log(tournament?.innerHTML.includes("tournament"));
}

export function renderGame(): string {
    let html: string = `
		<div class="min-h-screen flex flex-col items-center justify-center bg-white">
			<h1 class="text-4xl font-bold mb-6"> Game Screen </h1>
			<canvas id="canvas" width="480" height="270"
			class="border mb-6 bg-aliceblue border-4 border-[#8ec7fc] rounded-[20px]">
			pong game <!-- fallback if unable to be displayed -->
			</canvas>
			<a href="/central" data-link id="back-btn" 
			class="mt-4 py-3 px-8 rounded-full border-1 border-black \
			bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md \
			hover:scale-105 transition-all text-white text-lg font-semibold">
			Back
			</a>
		</div>
	`;
    return html;
}
