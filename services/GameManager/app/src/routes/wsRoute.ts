import { wsHandler } from '../lobby/wsHandler.js'
import type { FastifyPluginCallback } from 'fastify';

const wsRoute: FastifyPluginCallback = function (serv, options, done) {
	serv.get('/api/game/lobby', { websocket: true }, wsHandler);
	done();
}

export { wsRoute };
