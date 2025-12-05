import type { FastifyPluginCallback } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { notifHandler } from './notifications/notif-handler';

function handler(req: FastifyRequest, res: FastifyReply) {
	try {
		res.sendFile('index.html');
	} catch {
		console.log('ERROR');
	}
}

const servRoutes: FastifyPluginCallback = function (serv, options, done) {
	serv.get('/*', handler);
	serv.get('/notification/:userID', { websocket: true }, notifHandler);
	done();
};

export { servRoutes };
