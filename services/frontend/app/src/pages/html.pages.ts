// import { translate } from './language/translationHTML.js';
// import { renderLanguageDropdownButton } from './language/languageDropdownButtonHTML.js'
import { renderPageTemplate } from './page.template.js'

export function renderHome(): string {
	let html = `
		<div class="top-center-button" id="lang-dropdown-container"></div>
			<div class="min-h-screen flex items-center justify-center bg-white">
				<a
					href="/central"
					data-link
					id="play-btn"
					class="relative flex items-center justify-center px-20 py-8 rounded-full bg-gradient-to-br from-[#ea9800] to-[#ffcc00] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group text-white font-bold text-5xl uppercase tracking-widest"
					title="Play"
				>
					<span class="absolute inset-0 rounded-full border-2 border-black/80 pointer-events-none"></span>
					<span class="relative z-10">Play</span>
				</a>
			</div>
	`;
	// html += renderLanguageDropdownButton();
	return html;
}

export function renderCentral(): string {
	// return renderPageTemplate({
	// 	title: translate('CENTRAL'),
	// 	nextButtons: [
	// 	{ href: "/game/tournament", label: translate('Tournament') },
	// 	{ href: "/quickMatch", label: translate('Quick Match') },
	// 	{ href: "/account", label: translate('Profile') },
	// 	{ href: "/game/leaderboard", label: translate('Leaderboard') },
	// 	{ href: "/game/match", label: translate('Game') },
	// 	],
	// 	backHref: "/",
	// 	showBack: true,
	// 	homeHref: "/"
	// });
	return renderPageTemplate({
		title: 'CENTRAL',
		nextButtons: [
		{ href: "/game/tournament", label: 'Tournament' },
		{ href: "/quickMatch", label: 'Quick Match' },
		{ href: "/account", label: 'Profile' },
		{ href: "/game/leaderboard", label: 'Leaderboard' },
		{ href: "/game/match", label: 'Game'},
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
			// { href: "/accountSettings", label: translate("Account Settings") },
			// { href: "/editProfile", label: translate("Edit Profile") }
			{ href: "/accountSettings", label:"Account Settings" },
			{ href: "/editProfile", label:"Edit Profile" }
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
			{ href: "/404", label: "16 players" },

		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}

export function renderGame(): string {
	let html: string = `
	<div class="min-h-screen flex flex-col items-center justify-center bg-white">
		<h1>Game Screen</h1>
		<canvas id="canvas"
		class= "border mb-6 bg-aliceblue border-4 border-[#8ec7fc] rounded-[20px]">
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

export function render404(): string {
	let html: string = `
	<div class="container">
		<img src="/capybara.webp" alt="capy" style="width:100%;">
	</div>
	`
	return html;
}
