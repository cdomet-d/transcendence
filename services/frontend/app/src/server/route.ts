import fsp from 'fs/promises';
import type { FastifyPluginCallback } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { buildHtmlPage } from './build.html.js';

async function handler(req: FastifyRequest, rep: FastifyReply) {
    const html = buildHtmlPage(req.routeOptions.url);
    rep.header('Content-Type', 'text/html');
    rep.send(html)
    // rep.html(); //for vite
}

const servRoutes: FastifyPluginCallback = function (serv, options, done) {
    serv.get('/', handler);
    serv.get('/central', handler);
    serv.get('/account', handler);
    serv.get('/auth', handler);
    serv.get('/user/friends', handler);
    serv.get('/users', handler);
    serv.get('/game/leaderboard', handler);
    serv.get('/game/tournament', handler);
    serv.get('/game/match', handler);
    done();
}

export { servRoutes };
