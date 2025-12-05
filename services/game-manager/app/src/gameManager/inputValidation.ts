import { Ajv } from "ajv";
import type { FastifyRequest } from "fastify";
import type { WebSocket } from '@fastify/websocket';
import { wsSend } from "../lobby/wsHandler.gm.js";

const ajv = new Ajv();

export const baseMessageSchema = {
	type: "object",
	properties: {
		event: { type: "string" },
		payload: { type: "object" },
		formInstance: { type: "string" },
	},
	required: ["event", "payload"],
};

export const lobbyRequestPayloadSchema = {
	type: "object",
	properties: {
		action: { type: "string" },
		format: { type: "string" },
		userID: { type: "string" },
		lobbyID: { type: "string" }
	},
	required: ["action", "format", "userID"],
};

export const lobbyInvitePayloadSchema = {
	type: "object",
	properties: {
		action: { type: "string" },
		format: { type: "string" },
		inviteeID: { type: "string" },
		lobbyID: { type: "string" },
		hostID: { type: "string" }
	},
	required: ["action", "inviteeID"],
};

export const gameRequestPayloadSchema = {
	type: "object",
	properties: {
		userList: {
			type: "array",
			items: {
				type: "object",
				properties: {
					userID: { type: "string" },
					username: { type: "string" },
					userSocket: { type: "object" }
				},
				additionalProperties: false
			}
		},
		remote: { type: "boolean" },
		format: { type: "string" },
		nbPlayers: { type: "number" }
	},
	required: ["userList", "remote", "format", "nbPlayers"],
};

export const validateBaseMessage = ajv.compile(baseMessageSchema);
export const validateLobbyRequestPayload = ajv.compile(lobbyRequestPayloadSchema);
export const validateLobbyInvitePayload = ajv.compile(lobbyInvitePayloadSchema);
export const validateGameRequestPayload = ajv.compile(gameRequestPayloadSchema);

export const validators = {
	LOBBY_REQUEST: validateLobbyRequestPayload,
	GAME_REQUEST: validateGameRequestPayload,
	LOBBY_INVITE: validateLobbyInvitePayload
};

export function validateData(data: any, req: FastifyRequest, socket: WebSocket): boolean {
	if (!validateBaseMessage(data)) {
		req.server.log.error(`Invalid message structure: ${ajv.errorsText(validateBaseMessage.errors)}`);
		wsSend(socket, JSON.stringify({ error: "Invalid message format" }));
		return false;
	}
	return true;
}

export function validatePayload(data: any, payload: any, req: FastifyRequest, socket: WebSocket): boolean {
	type EventType = keyof typeof validators;
	const event = data.event;
		if (typeof event === "string" && event in validators) {
			const validate = validators[event as EventType];
			if (!validate(payload)) {
			req.server.log.error(`Invalid payload for event ${event}: ${ajv.errorsText(validate.errors)}`);
			wsSend(socket, JSON.stringify({ error: "Invalid message payload" }));
			return false;
		}
	} else {
		req.server.log.error(`Unknown or missing event type: ${event}`);
		wsSend(socket, JSON.stringify({ error: "Unknown event type" }));
		return false;
	}
	return true;
}
