import { wsHandler } from '../lobby/wsHandler.gm.js'
import type { FastifyPluginCallback } from 'fastify';

const wsRoute: FastifyPluginCallback = function (serv, options, done) {
	serv.get('/api/lobby/', { websocket: true }, wsHandler);
	done();
}

export { wsRoute };
