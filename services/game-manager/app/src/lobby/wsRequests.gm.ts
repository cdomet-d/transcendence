import type { FastifyInstance, FastifyRequest } from "fastify";
import type { lobbyInfo } from "../gameManager/gameManager.interface.js";
import { createLobby, findLobbyIDFromUserID, removeUserFromLobby } from "./lobby.gm.js";
import type { lobbyInviteForm, lobbyRequestForm } from "./lobby.interface.js";
import { wsSend } from "./wsHandler.gm.js";
import { processGameRequest } from "../gameManager/gameManager.js";
import { handleDeclineAction, handleInviteAction, handleJoinAction } from "./wsInvites.gm.js";
import { verifyUserIDMatch } from "./wsUtils.gm.js";

function handleLobbyRequest(lobbyPayload: lobbyRequestForm, authenticatedUserID: string, authenticatedUsername: string, socket: WebSocket, formInstance: string, req: FastifyRequest): void {
    if (!verifyUserIDMatch(lobbyPayload.userID, authenticatedUserID, req, socket)) {
        return;
    }

    if (lobbyPayload.action === 'create') {
        const existingLobbyID = findLobbyIDFromUserID(authenticatedUserID);
        if (existingLobbyID !== null) {
            removeUserFromLobby(authenticatedUserID, existingLobbyID);
        }

        const newLobby: lobbyInfo = createLobby(
            { userID: authenticatedUserID, username: authenticatedUsername, userSocket: socket },
            lobbyPayload.format!
        );

        wsSend(socket, JSON.stringify({
            lobby: 'created',
            lobbyID: newLobby.lobbyID,
            formInstance: formInstance
        }));
    }
}

function handleGameRequest(fastify: FastifyInstance, gamePayload: lobbyInfo, authenticatedUserID: string, socket: WebSocket, req: FastifyRequest): void {
    if (gamePayload.hostID !== authenticatedUserID) {
        req.server.log.warn(`Unauthorized game start attempt by ${authenticatedUserID}`);
        wsSend(socket, JSON.stringify({ error: 'not lobby host' }));
        return;
    }

    if (findLobbyIDFromUserID(authenticatedUserID) === null) {
        wsSend(socket, JSON.stringify({ error: 'user not in lobby' }));
        return;
    }

    if (processGameRequest(fastify, gamePayload) === false) {
        req.server.log.error("processGameRequest failed: not enough players");
        wsSend(socket, JSON.stringify({ error: 'not enough players' }));
    }
}

function handleLobbyInvite(fastify: FastifyInstance, invitePayload: lobbyInviteForm, authenticatedUserID: string, authenticatedUsername: string, formInstance: string, socket: WebSocket, req: FastifyRequest): void {
    switch (invitePayload.action) {
        case 'invite':
            handleInviteAction(fastify, invitePayload, authenticatedUserID, formInstance, socket, req);
            break;
        case 'decline':
            handleDeclineAction(fastify, invitePayload, authenticatedUserID, socket, req);
            break;
        case 'join':
            handleJoinAction(invitePayload, authenticatedUserID, authenticatedUsername, formInstance, socket, req, fastify);
            break;
    }
}


export { handleGameRequest, handleLobbyRequest, handleLobbyInvite };