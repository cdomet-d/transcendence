// import fsp from 'fs/promises';
// import { buildHtmlPage } from './build.html.js';
import type { FastifyPluginCallback } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
// import { setLangVars } from '../client/scripts/language/translation.js';

// function initLanguageSSR(req: FastifyRequest) {
//     let savedLang: string | undefined = req.cookies['lang'];
//     if (!savedLang) savedLang = 'en';
//     setLangVars(savedLang);
// }

function handler(req: FastifyRequest, rep: FastifyReply) {
    // initLanguageSSR(req);
    // const url: string | undefined = req.routeOptions.url;
    // if (!url) {
    //     rep.callNotFound();
    //     return;
    // }
    // const html = buildHtmlPage(url);
    rep.header('Content-Type', 'text/html');
    rep.sendFile('pages/index.html');
}

const servRoutes: FastifyPluginCallback = function (serv, options, done) {
    serv.get('/*', handler);
    done();
};

export { servRoutes };
