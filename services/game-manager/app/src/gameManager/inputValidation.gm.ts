import { Ajv } from 'ajv';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { wsSend } from '../lobby/wsHandler.gm.js';

const ajv = new Ajv();

const baseMessageSchema = {
	type: 'object',
	properties: {
		event: { type: 'string' },
		payload: { type: 'object' },
		formInstance: { type: 'string' }
	},
	required: ['event', 'payload'],
};

const lobbyRequestPayloadSchema = {
	type: 'object',
	properties: {
		action: { type: 'string' },
		format: { type: 'string' },
		userID: { type: 'string' },
		username: { type: 'string'},
		lobbyID: { type: 'string' }
	},
	required: ['action', 'format', 'userID', 'username'],
};

const lobbyInvitePayloadSchema = {
	type: 'object',
	properties: {
		action: { type: 'string' },
		format: { type: 'string' },
		invitee: { 
			type: 'object',
			properties: {
				userID: { type: 'string'},
				username: { type: 'string'}
			},
			required: ['userID'],
			additionalProperties: false,
		},
		lobbyID: { type: 'string' },
		hostID: { type: 'string' }
	},
	required: ['action', 'invitee'],
};

const gameRequestPayloadSchema = {
	type: 'object',
	properties: {
		lobbyID: {type: 'string' },
		hostID: {type: 'string'},
		userList: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					userID: { type: 'string' },
					username: { type: 'string' },
					userSocket: { type: 'object' }
				},
				additionalProperties: false
			}
		},
		remote: { type: 'boolean' },
		format: { type: 'string' },
		nbPlayers: { type: 'number' },
		gameSettings: {
			type: 'object',
			properties: {
				background: { type: 'string'},
				ballspeed: { type: 'string'},
				horizontal: { type: 'string'},
				paddlesize: { type: 'string'},
				paddlespeed: { type: 'string'},
				opponent: { type: 'string'},
			},
		}
	},
	required: ['lobbyID', 'hostID', 'remote', 'format', 'nbPlayers', 'gameSettings'],
};

const pingPongPaylodSchema = {
	type: 'object',
	properties: {
		notif: { type: 'string' },
	},
	required: ['notif'],
}

const inviteeSignalPaylodSchema = {
	type: 'object',
	properties: {
		signal: { type: 'string' },
	},
	required: ['signal'],
}

const validateBaseMessage = ajv.compile(baseMessageSchema);
const validateLobbyRequestPayload = ajv.compile(lobbyRequestPayloadSchema);
const validateLobbyInvitePayload = ajv.compile(lobbyInvitePayloadSchema);
const validateGameRequestPayload = ajv.compile(gameRequestPayloadSchema);
const validatePingPongNotif = ajv.compile(pingPongPaylodSchema);
const validateInviteeSignal = ajv.compile(inviteeSignalPaylodSchema);

const validators = {
	LOBBY_REQUEST: validateLobbyRequestPayload,
	GAME_REQUEST: validateGameRequestPayload,
	LOBBY_INVITE: validateLobbyInvitePayload,
	NOTIF: validatePingPongNotif,
	SIGNAL: validateInviteeSignal,
};

export function validateData(data: any, serv: FastifyInstance, socket: WebSocket): boolean {
	if (!validateBaseMessage(data)) {
		serv.log.error(`Invalid message structure: ${ajv.errorsText(validateBaseMessage.errors)}`);
		wsSend(socket, JSON.stringify({ error: 'Invalid message format' }));
		return false;
	}
	return true;
}

export function validatePayload(data: any, payload: any, serv: FastifyInstance, socket: WebSocket): boolean {
	type EventType = keyof typeof validators;
	const event = data.event;
		if (typeof event === 'string' && event in validators) {
			const validate = validators[event as EventType];
			if (!validate(payload)) {
			serv.log.error(`Invalid payload for event ${event}: ${ajv.errorsText(validate.errors)}`);
			wsSend(socket, JSON.stringify({ error: 'Invalid message payload' }));
			return false;
		}
	} else {
		serv.log.error(`Unknown or missing event type: ${event}`);
		wsSend(socket, JSON.stringify({ error: 'Unknown event type' }));
		return false;
	}
	return true;
}
