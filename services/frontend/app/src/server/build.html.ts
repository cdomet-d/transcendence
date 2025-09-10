import { routes } from '../client/spaRouter/routes.js';
import { renderHeader } from '../pages/header.js';

function buildHtmlPage(url: string | undefined): string {
    if (url === undefined)
        return "error"; //TODO: fix that
    const route = routes.find(routes => routes.path == url);
    const app: string | undefined = route?.callback();
    let header: string = "";
    if (url !== "/")
        header = renderHeader();
    const html: string = `
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
        <div id="header">${header}</div>
        <div id="app">${app}</div>
    </body>
    </html>
    `;
    return html;
}

export { buildHtmlPage };