import { sendInviteNotifs } from '../inviteNotifs/invite-notifs.js';
import { wsHandler } from '../lobby/wsHandler.gm.js'
import type { FastifyPluginCallback } from 'fastify';

const routes: FastifyPluginCallback = function (serv, options, done) {
	serv.get('/api/lobby/', { websocket: true }, wsHandler);
	serv.get('/api/lobby/notification/:userID', {schema: notifSchema}, sendInviteNotifs);
	done();
}

const notifSchema = {
	params: {
		type: 'object',
		properties: {
			userID: { type: 'string' }
		},
		required: ['userID']
	},
	response: {
		200: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					type: { type: 'string', enum: ['GAME_INVITE'] },
					senderUsername: { type: 'string' },
					receiverID: { type: 'string' },
					lobbyID: { type: 'string' },
					gameType: { type: 'string' }
				},
				required: ['type', 'senderUsername', 'receiverID', 'lobbyID', 'gameType'],
			}
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' }
			},
			required: ['error']
		}
	}
}

export { routes };
