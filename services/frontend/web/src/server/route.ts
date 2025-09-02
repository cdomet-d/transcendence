import fsp from 'fs/promises';
import type { FastifyPluginCallback } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';

async function handler(req: FastifyRequest, rep: FastifyReply) {
    try {
        const script = await fsp.readFile("/app/static/index.html");
        rep.header('Content-Type', 'text/html');
        rep.send(script);
    }
    catch (err) {
        const error = err as NodeJS.ErrnoException;
        rep.code(500).send(error.message);
    }
}

const mainRoute: FastifyPluginCallback = function (serv, options, done) {
    serv.get('/', handler);
    serv.get('/account', handler);
    serv.get('/auth', handler);
    serv.get('/user/friends', handler);
    serv.get('/users', handler);
    serv.get('/game/leaderboard', handler);
    serv.get('/game/tournament', handler);
    serv.get('/game/match', handler);
    done();
}

export { mainRoute };
