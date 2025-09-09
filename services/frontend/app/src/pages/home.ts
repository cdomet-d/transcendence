import { translate } from './language/translation.js';
import { renderLanguageDropdownButton } from './language/languageDropdownButton.js'

export function renderHome(): string {
	let html = `
	<!doctype html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" type="image/svg+xml" href="/images/sunflower.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>🔥 PONG 2 OUF 🔥</title>
	</head>
	<body>
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
	</body>
	</html>
	`;
	html += renderLanguageDropdownButton();
	return html;
}
