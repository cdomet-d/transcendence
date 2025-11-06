import { routes } from '../client/scripts/spaRouter/routes.js';
// import { renderHeader } from '../client/pages/header.js';
// import { renderLanguageDropdownButton } from '../client/pages/languageDropdownButton.js'

function buildHtmlPage(url: string) {
    const route = routes.find((routes) => routes.path == url);
    console.log('BuildingHTMLPage', route);
}

export { buildHtmlPage };
