import { createLink } from '../web-elements/navigation/buttons-helpers.js';
import { createHeading, createNoResult } from '../web-elements/typography/helpers.js';
import { FullscreenPage } from '../web-elements/layouts/fullscreen.js';
import { pageWithHeader } from '../web-elements/layouts/page-with-header.js';
import { renderPageTemplate } from './page.template.js';
import { translate } from '../scripts/language/translation.js';
import type { navigationLinksData } from '../web-elements/types-interfaces.js';
import type { Layout } from '../web-elements/layouts/layout.js';

interface HTMLElementTagMap {
    'page-w-header': pageWithHeader;
    'full-screen': FullscreenPage;
}

const layoutPerPage: { [key: string]: string } = {
    home: 'full-screen',
    regitration: 'full-screen',
    error: 'full-screen',
    game: 'full-screen',
    leaderboard: 'page-w-header',
    lobby: 'page-w-header',
    profile: 'page-w-header',
    userSettings: 'page-w-header',
};

function prepareLayout<K extends keyof HTMLElementTagMap>(curLayout: Layout | null, HTMLMapKey: K, page: string) {
	if (!layoutPerPage[page]) throw new Error ('Requested page is undefined');
    console.log(curLayout?.id, layoutPerPage[page]);
    if (!curLayout) {
        const newLayout = document.createElement('div', {
            is: HTMLMapKey,
        }) as HTMLElementTagMap[K];
        document.body.append(newLayout);
        document.body.layoutInstance = newLayout;
    } else if (curLayout.id !== layoutPerPage[page]) {
        curLayout.clearAll();
        curLayout.remove();
        const newLayout = document.createElement('div', {
            is: HTMLMapKey,
        }) as HTMLElementTagMap[K];
        document.body.append(newLayout);
        document.body.layoutInstance = newLayout;
    } else {
        curLayout.clearAll();
    }
}

export function renderNotFound() {
    console.log('renderNotFound');
    prepareLayout(document.body.layoutInstance, 'full-screen', 'error');
    document.body.layoutInstance!.appendAndCache(createNoResult('ifs'));
}

export function renderHome() {
    console.log('RenderHome');
    prepareLayout(document.body.layoutInstance, 'full-screen', 'home');
    const playButtonData: navigationLinksData = {
        title: 'PLAY',
        href: '/register',
        datalink: '/register',
    };
    document.body.layoutInstance!.appendAndCache(
        createHeading('0', 'PONG!'),
        createLink(playButtonData, true)
    );
}

export function renderCentral(): string {
    return renderPageTemplate({
        title: translate('CENTRAL'),
        nextButtons: [
            { href: '/game/tournament', label: translate('Tournament') },
            { href: '/quickMatch', label: translate('Quick Match') },
            { href: '/account', label: translate('Profile') },
            { href: '/game/leaderboard', label: translate('Leaderboard') },
            { href: '/game/match', label: translate('Game') },
        ],
        backHref: '/',
        showBack: true,
        homeHref: '/',
    });
}

export function renderLeaderboard(): string {
    return renderPageTemplate({
        title: 'LEADERBOARD',
        nextButtons: [],
        backHref: '/central',
        showBack: true,
        homeHref: '/',
    });
}

export function renderProfile(): string {
    return renderPageTemplate({
        title: 'PROFILE',
        nextButtons: [
            { href: '/accountSettings', label: translate('Account Settings') },
            { href: '/editProfile', label: translate('Edit Profile') },
        ],
        backHref: '/central',
        showBack: true,
        homeHref: '/',
    });
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
			class="mt-4 py-3 px-8 rounded-full border-1 border-black bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold">
			Back
			</a>
		</div>
	`;
    return html;
}
