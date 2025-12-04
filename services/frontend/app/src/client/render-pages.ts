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
import { userStatus, router, type userStatusInfo } from './main.js';
import { loginForm, registrationForm } from './web-elements/forms/default-forms.js';
import { wsConnect } from './lobby/wsConnect.front.js';
import type { Menu } from './web-elements/navigation/basemenu.js';
import { createLink } from './web-elements/navigation/buttons-helpers.js';
import type { NavigationLinks } from './web-elements/navigation/links.js';
import { defaultDictionary } from './web-elements/forms/language.js'

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
    prepareLayout(document.body.layoutInstance, 'error');
    const goHome = createLink(goHomeData, false) as NavigationLinks;
    document.body.layoutInstance!.appendAndCache(createNoResult('dark', 'ifs'), goHome);
    goHome.classList.remove('w-full');
    goHome.classList.add('w-1/4', 'place-self-center');
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
    
    const authOptions: TabData[] = [
        {
            id: 'login-tab',
            content: 'Login',
            default: true,
            panelContent: createForm('login-form', loginForm(defaultDictionary)),
        },
        {
            id: 'registration-tab',
            content: 'Register',
            default: false,
            panelContent: createForm('registration-form', registrationForm(defaultDictionary)),
        },
    ];
    wrapper.append(createTabs(authOptions));
    document.body.layoutInstance!.appendAndCache(wrapper);
    updatePageTitle('Login | Register');
}

export async function renderLeaderboard() {
    console.log('renderLeaderboard');
    prepareLayout(document.body.layoutInstance, 'leaderboard');

    const url = 'https://localhost:8443/api/bff/leaderboard';

    //TODO: crashes if user is not registered
    try {
        const rawRes = await fetch(url);
        if (rawRes.status === 401)
            return redirectOnError('/auth', 'You must be registered to see this page');
        if (!rawRes.ok) throw await exceptionFromResponse(rawRes);

        const res = await rawRes.json();
        document.body.layoutInstance!.appendAndCache(
            createHeading('2', 'Leaderboard'),
            createLeaderboard(userArrayFromAPIRes(res)),
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
        const res = await fetch(url);
        if (!res.ok) {
            if (res.status === 404) renderNotFound();
            else throw await exceptionFromResponse(res);
        }
        buildUserProfile(res);
        updatePageTitle(status.username!);
    } catch (error) {
        redirectOnError(router.stepBefore, 'Error: ' + errorMessageFromException(error));
    }
}

export async function renderProfile(param?: Match<Partial<Record<string, string | string[]>>>) {
    console.log('renderProfile');
    if (param && param.params.login && typeof param.params.login === 'string') {
        const status = await userStatus();
        if (!status.auth)
            return redirectOnError('/auth', 'You must be registered to see this page');

        const login = param.params.login;
        const url = `https://localhost:8443/api/bff/profile/${login}`;
        try {
            prepareLayout(document.body.layoutInstance, 'profile');
            const res = await fetch(url);
            if (!res.ok) {
                if (res.status === 404) renderNotFound();
                else throw await exceptionFromResponse(res);
            }
            buildUserProfile(res);
            updatePageTitle(login);
        } catch (error) {
            redirectOnError(router.stepBefore, 'Error: ' + errorMessageFromException(error));
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
        const user = userDataFromAPIRes(res);
        const form = userSettingsForm(defaultDictionary);
        document.body.layoutInstance?.appendAndCache(createForm('settings-form', form, user));
    } catch (error) {
        redirectOnError(router.stepBefore, 'Error: ' + errorMessageFromException(error));
    }
    updatePageTitle(status.username + 'Settings');
}

export function renderLobbyMenu() {
    console.log('renderLobbyMenu');
    prepareLayout(document.body.layoutInstance, 'lobbyMenu');
    document.body.layoutInstance?.appendAndCache(
        createHeading('1', 'Choose Lobby'),
        createMenu(lobbyQuickmatchMenu, 'horizontal', true),
        createMenu(lobbyTournamentMenu, 'vertical', true),
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
export async function renderQuickLocalLobby() {
    prepareLayout(document.body.layoutInstance, 'quickLobby');
    document.body.layoutInstance?.appendAndCache(createForm('local-pong-settings', localPong(defaultDictionary)));

    const user: userStatusInfo = await userStatus();
    if (!user.auth) {
        redirectOnError('/auth', 'You must be registered to see this page')
        return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    }

    wsConnect('create', 'quickmatch', 'localForm');
}

export async function renderQuickRemoteLobby(
    param?: Match<Partial<Record<string, string | string[]>>>,
    gameRequest?: gameRequest,
    action?: string
) {
    prepareLayout(document.body.layoutInstance, 'quickLobby');
    document.body.layoutInstance?.appendAndCache(createForm('remote-pong-settings', remotePong));

    const user: userStatusInfo = await userStatus();
    if (!user.auth) {
        redirectOnError('/auth', 'You must be registered to see this page')
        return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    }

    if (action === undefined) action = 'create';
    
    wsConnect(action!, 'quickmatch', 'remoteForm');
}

export async function renderTournamentLobby() {
    prepareLayout(document.body.layoutInstance, 'tournamentLobby');
    document.body.layoutInstance?.appendAndCache(createForm('remote-pong-settings', pongTournament));

    const user: userStatusInfo = await userStatus();
    if (!user.auth) {
        redirectOnError('/auth', 'You must be registered to see this page')
        return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    }

    wsConnect('create', 'tournament', 'tournamentForm');
}

export async function renderGame(
    param?: Match<Partial<Record<string, string | string[]>>>,
    gameRequest?: gameRequest,
) {
    console.log('renderGame');

    if (!gameRequest)
        return redirectOnError('/', "Uh-oh! You can't be there - go join a lobby or something !");
    prepareLayout(document.body.layoutInstance, 'game');

    console.log(gameRequest);
    const court = document.createElement('div', { is: 'pong-court' }) as PongCourt;
    const ui = document.createElement('div', { is: 'pong-ui' }) as PongUI;

    //TODO: set playerNames from game-manager object
    const user: userStatusInfo = await userStatus();
    if (!user.auth) {
        redirectOnError('/auth', 'You must be registered to see this page')
        return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    }
    if (user.username === undefined) {
        //TODO: why could it be undefined?
        return;
    }
    ui.player1.innerText = user.username;
    ui.player2.innerText = gameRequest.opponent;

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
    prepareLayout(document.body.layoutInstance, 'bracket');

    const bracket = document.createElement('div', {
        is: 'tournament-bracket',
    }) as TournamentBrackets;
    if (bracket) bracket.players = tournament;
    document.body.layoutInstance?.appendAndCache(bracket);
}
