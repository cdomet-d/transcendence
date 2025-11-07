import { createHeading, createNoResult } from '../web-elements/typography/helpers.js';
import { createLeaderboard } from '../web-elements/matches/leaderboard.js';
import { createNavMenu } from '../web-elements/navigation/menu-helpers.js';
import { mainMenu } from '../web-elements/navigation/default-menus.js';
import { renderPageTemplate } from './page.template.js';
import { Layout } from '../web-elements/layouts/layout.js';
import { ProfileWithTabs } from '../web-elements/users/user-profile-containers.js';
// import { user } from '../web-elements/default-values.js';

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
        createNavMenu(mainMenu, 'vertical', true),
    );
    updatePageTitle('Home');
}

export function renderLeaderboard() {
    console.log('renderLeaderboard');
    prepareLayout(document.body.layoutInstance, 'leaderboard');
    document.body.layoutInstance!.appendAndCache(
        createHeading('1', 'Leaderboard'),
        createLeaderboard([]),
    );
}

export function renderProfile() {
    console.log('renderProfile');
    //TODO: API call here to fetch user data
    prepareLayout(document.body.layoutInstance, 'profile');
    document.body.layoutInstance?.appendAndCache(
        document.createElement('div', { is: 'profile-page' }) as ProfileWithTabs,
    );
}

export function renderTournament(): string {
    return renderPageTemplate({
        title: 'TOURNAMENT',
        nextButtons: [
            { href: '/404', label: '4 players' },
            { href: '/404', label: '8 players' },
            { href: '/404', label: '16 players' },
        ],
        backHref: '/central',
        showBack: true,
        homeHref: '/',
    });
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
