import { createHeading, createNoResult } from './web-elements/typography/helpers.js';
import { createLeaderboard } from './web-elements/statistics/leaderboard.js';
import { createMenu } from './web-elements/navigation/menu-helpers.js';
import { main } from './web-elements/navigation/default-menus.js';
import { farmAssets, Layout } from './web-elements/layouts/layout.js';
import { ProfileWithTabs } from './web-elements/users/user-profile-containers.js';
import { type Match } from 'path-to-regexp';
import { createTabs } from './web-elements/navigation/tabs-helpers.js';
import { type TabData } from './web-elements/types-interfaces.js';
import { createForm } from './web-elements/forms/helpers.js';
import {
    localPong,
    registrationForm,
    remotePong,
    userSettingsForm,
} from './web-elements/forms/default-forms.js';
import { user } from './web-elements/default-values.js';
import { PongCourt } from './web-elements/game/pong-court.js';

//TODO: dynamic layout: fullscreen if the user is not logged in, header if he is ?
const layoutPerPage: { [key: string]: string } = {
    central: 'page-w-header',
    error: 'full-screen',
    game: 'full-screen',
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
    console.log('renderAuth');
    prepareLayout(document.body.layoutInstance, 'home');
    document.body.layoutInstance!.appendAndCache(createForm('default-form', registrationForm));
    updatePageTitle('Register or Login');
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

export function renderProfile(param?: Match<Partial<Record<string, string | string[]>>>) {
    console.log('renderProfile');
    if (param) {
        //TODO: API call with login here to fetch user data
        const login = param.params.login;
        prepareLayout(document.body.layoutInstance, 'profile');
        document.body.layoutInstance?.appendAndCache(
            document.createElement('div', { is: 'profile-page' }) as ProfileWithTabs,
        );
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

    // HERE logic will be needed from the game manager so that we know what theme the player picked.
    const court = document.createElement('div', { is: 'pong-court' }) as PongCourt;
    const layout = document.body.layoutInstance;
	court.theme = 'farm';
    if (layout) layout.theme = farmAssets;
    document.body.layoutInstance?.appendAndCache(court);
}
