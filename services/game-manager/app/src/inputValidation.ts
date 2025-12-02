import { Ajv } from "ajv";
import type { FastifyRequest } from "fastify";
import type { WebSocket } from '@fastify/websocket';
import { wsSend } from "./lobby/wsHandler.gm.js";

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

export const lobbyInfoSchema = {
    type: "object",
    properties: {
        lobbyID: { type: "string", nullable: true },
        whitelist: {
            type: "object",
            properties: {
                lobbyId: { type: "string" },
                hostID: { type: "number" },
                userIDs: { type: "object", additionalProperties: true },
            },
            required: ["lobbyId", "hostID", "userIDs"],
            nullable: true,
        },
        joinable: { type: "boolean", nullable: true },
        userList: { type: "object", additionalProperties: true },
        remote: { type: "boolean" },
        format: { type: "string" },
        nbPlayers: { type: "number" },
    },
    required: ["userList", "remote", "format", "nbPlayers"],
};

export const gameRequestSchema = {
    type: "object",
    properties: {
        opponent: { type: "string" },
        gameID: { type: "string" },
        remote: { type: "boolean" },
    },
    required: ["opponent", "gameID", "remote"],
};

export const validateBaseMessage = ajv.compile(baseMessageSchema);
export const validateLobbyInfo = ajv.compile(lobbyInfoSchema);
export const validateGameRequest = ajv.compile(gameRequestSchema);

export const validators = {
    LOBBY_REQUEST: validateLobbyInfo,
    GAME_REQUEST: validateGameRequest,
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
