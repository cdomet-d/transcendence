import { translate } from './language/translationHTML.js';
import { renderLanguageDropdownButton } from './language/languageDropdownButtonHTML.js'
import { renderPageTemplate } from './page.templateHTML.js'

export function renderHome(): string {
	let html = `
	<!doctype html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" type="image/svg+xml" href="/sunflower.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="/output.css">
		<script type="module" src="/main.js"></script>
		<title>🔥 PONG 2 OUF 🔥</title>
	</head>
	<body>
		<div id="app">
			<div class="top-center-button" id="lang-dropdown-container"></div>
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
		</div>
	`;
	const end: string = `
	</body>
	</html>`
	html += renderLanguageDropdownButton();
	html += end;
	return html;
}

export function renderCentral(): string {
	return renderPageTemplate({
		title: translate('CENTRAL'),
		nextButtons: [
		{ href: "/game/tournament", label: translate('Tournament') },
		{ href: "/quickMatch", label: translate('Quick Match') },
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
			{ href: "/404", label: "16 players" },

		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}
