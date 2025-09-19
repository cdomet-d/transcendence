import { translate } from '../scripts/language/translation.js';
import { renderPageTemplate } from './page.template.js'

export function renderHome(): string {
	let html = `
		<div class="min-h-screen flex items-center justify-center bg-white">
			<a
				href="/central"
				data-link
				id="play-btn"
				class="relative flex items-center justify-center px-20 py-8 rounded-full bg-gradient-to-br from-[#ea9800] to-[#ffcc00] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group text-white font-bold text-5xl uppercase tracking-widest"
				title="${translate('Play')}"
			>
				<span class="absolute inset-0 rounded-full border-2 border-black/80 pointer-events-none"></span>
				<span class="relative z-10">${translate('Play')}</span>
			</a>
		</div>
	`;
	return html;
}

export function renderCentral(): string {
	return renderPageTemplate({
		title: translate('CENTRAL'),
		nextButtons: [
			{ href: "/game/tournament", label: translate('Tournament') },
			{ href: "/game/menu", label: translate('Menu') },
			{ href: "/account", label: translate('Profile') },
			{ href: "/game/leaderboard", label: translate('Leaderboard') },
			{ href: "/game/match", label: translate('Game') },
		],
		backHref: "/",
		showBack: true,
		homeHref: "/"
	});
}

export function renderLeaderboard(): string {
	return renderPageTemplate({
		title: "LEADERBOARD",
		nextButtons: [
		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}

export function renderProfile(): string {
	return renderPageTemplate({
		title: "PROFILE",
		nextButtons: [
			{ href: "/accountSettings", label: translate("Account Settings") },
			{ href: "/editProfile", label: translate("Edit Profile") }
		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}

export function renderTournament(): string {
	return renderPageTemplate({
		title: "TOURNAMENT",
		nextButtons: [
			{ href: "/404", label: "4 players" },
			{ href: "/404", label: "8 players" },

		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}

export function renderGame(): string {
	let html: string = `
		<div class="min-h-screen flex flex-col items-center justify-center bg-white">
			<h1 class="text-4xl font-bold mb-6"> Game Screen </h1>
			<canvas id="canvas" width="480" height="270"
			class="mb-6 bg-aliceblue border-4 border-[#8ec7fc] rounded-[20px]">
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

export function renderGameMenu(): string {
	let html: string = `
		<div class="relative min-h-screen flex flex-col items-center justify-center">
		    <button id="look-opponent-btn"
			class="py-3 px-8 rounded-full border border-black bg-gradient-to-br from-blue-500 to-blue-700 shadow-md hover:scale-105 transition-transform text-white text-lg font-semibold">
		        Find opponent
		    </button>

		    <a href="/central" data-link id="back-btn"
			class="absolute bottom-8 left-1/2 transform -translate-x-1/2 py-3 px-8 rounded-full border border-black bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md hover:scale-105 transition-transform text-white text-lg font-semibold">
		        Back
		    </a>
		</div>
	`;
	return html;
}

export function render404(): string {
	let html: string = `
	<html>
	<body>
		<div class="container mx-auto px-4">
			<h1>Page 404</h1>
			<img src="/capybara.webp" alt="capy" style="width:100%;">
		</div>
	</body>
	</html>
	`
	return html;
}
