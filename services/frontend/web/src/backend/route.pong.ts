import fsp from 'fs/promises';
import type { FastifyPluginCallback } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';


async function handler(req: FastifyRequest, rep: FastifyReply) {
    try {
		const script = await fsp.readFile("/app/static/game.html");
		rep.header('Content-Type', 'text/html');
		rep.send(script);
	}
	catch (err) {
		const error = err as NodeJS.ErrnoException;
		rep.code(500).send(error.message);
	}
}

const matchRoute: FastifyPluginCallback = function (serv, options, done) {
    serv.get('/game/match', handler);
    done();
}

export { matchRoute };
