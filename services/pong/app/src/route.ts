import { wsHandler } from './game/ws-handler.js'
import type { FastifyPluginCallback } from 'fastify';

const wsRoute: FastifyPluginCallback = function (serv, options, done) {
	serv.get('/api/game/', { websocket: true }, wsHandler);
	done();
}

export { wsRoute };
