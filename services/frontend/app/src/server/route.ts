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

function handler(req: FastifyRequest, res: FastifyReply) {
    // initLanguageSSR(req);
    // const url: string | undefined = req.routeOptions.url;
    // if (!url) {
    //     res.callNotFound();
    //     return;
    // }
    // const html = buildHtmlPage(url);
	// res.setHeader('Content-Type', 'text/html');
	console.log('SERVING HTML')
	try {
    	res.sendFile('index.html');
	} catch {
		console.log('ERROR')
	}
}

const servRoutes: FastifyPluginCallback = function (serv, options, done) {
	console.log('IN THE DYNAMIC ROUTES')
    serv.get('/*', handler);
    done();
};

export { servRoutes };
