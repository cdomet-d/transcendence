import { createBtn } from '../web-elements/navigation/buttons-helpers.js';
import { createHeading } from '../web-elements/typography/helpers.js';
import { FullscreenPage } from '../web-elements/layouts/fullscreen.js';
import { NoResults } from '../web-elements/typography/images.js';
import { renderPageTemplate } from './page.template.js';
import { translate } from '../scripts/language/translation.js';
import type { buttonData } from '../web-elements/types-interfaces.js';

export function renderNotFound() {
    console.log('rendering 404');
    document.body.append(document.createElement('div', { is: 'no-results' }) as NoResults);
}

export function renderHome() {
    const page: FullscreenPage = document.createElement('div', {
        is: 'full-screen',
    }) as FullscreenPage;

    document.body.append(page);

    const playButtonData: buttonData = {
        type: 'button',
        content: 'PLAY',
        img: null,
        ariaLabel: 'Click to play',
    };

    page.appendAndCache(createHeading('0', 'PONG!'), createBtn(playButtonData, true));
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
