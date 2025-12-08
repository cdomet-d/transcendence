import { sendInviteNotifs } from '../inviteNotifs/invite-notifs.js';
import { wsHandler } from '../lobby/wsHandler.gm.js'
import type { FastifyPluginCallback } from 'fastify';

const routes: FastifyPluginCallback = function (serv, options, done) {
	serv.get('/api/lobby/', { websocket: true }, wsHandler);
	serv.get('/api/lobby/notification/:userID', sendInviteNotifs);//TODO: add schema 
	done();
}

export { routes };
