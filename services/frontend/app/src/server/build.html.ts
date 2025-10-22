import { routes } from '../client/scripts/spaRouter/routes.js';
import { renderHeader } from '../client/pages/header.js';
import { renderLanguageDropdownButton } from '../client/pages/languageDropdownButton.js'

function buildHtmlPage(url: string): string {
	const route = routes.find(routes => routes.path == url);
	const page: string | undefined = route?.callback();

	let header: string = "";
	if (url !== "/")
		header = renderHeader();

	const langDropdown = renderLanguageDropdownButton();

	const html: string = `
	<!doctype html>
	<html lang="English">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" type="image/svg+xml" href="/sunflower.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="/output.css">
		<script type="module" src="/scripts/main.js"></script>
		<title>🔥 PONG 2 OUF 🔥</title>
	</head>
	<body>
		<div id="header">
			${header}
		</div>
		<div id="app">
			<div class="top-center-button" id="lang-dropdown-container">
				${langDropdown}
			</div>
			<div id="page">
				${page}
			</div>
		</div>
	</body>
	</html>
	`;
	return html;
}

export { buildHtmlPage };