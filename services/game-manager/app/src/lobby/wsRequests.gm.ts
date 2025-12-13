import type { FastifyInstance, FastifyRequest } from "fastify";
import type { lobbyInfo } from "../gameManager/gameManager.interface.js";
import { createLobby, findLobbyIDFromUserID, lobbyMap, removeUserFromLobby } from "./lobby.gm.js";
import type { lobbyInviteForm, lobbyRequestForm } from "./lobby.interface.js";
import { wsSend } from "./wsHandler.gm.js";
import { processGameRequest } from "../gameManager/gameManager.js";
import { handleDeclineAction, handleInviteAction, handleJoinAction } from "./wsInvites.gm.js";
import { verifyUserIDMatch } from "./wsUtils.gm.js";

function handleLobbyRequest(lobbyPayload: lobbyRequestForm, authenticatedUserID: string, authenticatedUsername: string, socket: WebSocket, req: FastifyRequest): void {
    if (!verifyUserIDMatch(lobbyPayload.userID, authenticatedUserID, req, socket)) {
        return;
    }

    if (lobbyPayload.action === 'create') {
        let existingLobbyID: string | undefined = findLobbyIDFromUserID(authenticatedUserID, socket);
        if (existingLobbyID !== undefined)
            removeUserFromLobby(authenticatedUserID, existingLobbyID, 0, req.server);
        const newLobby: lobbyInfo = createLobby(
            {userID: authenticatedUserID, username: authenticatedUsername, userSocket: socket }, 
            lobbyPayload.format!
        );

        wsSend(socket, JSON.stringify({ 
            lobby: 'created', 
            lobbyID: newLobby.lobbyID 
        }))
    }
}

function handleGameRequest(fastify: FastifyInstance, gamePayload: lobbyInfo, authenticatedUserID: string, socket: WebSocket, req: FastifyRequest): void {
    const lobbyID = gamePayload.lobbyID;
    if (lobbyID === null) {
        wsSend(socket, JSON.stringify({ error: 'user not in lobby' }));
        return;
    }

    const lobby = lobbyMap.get(lobbyID);
    if (!lobby) {
        wsSend(socket, JSON.stringify({ error: 'lobby not found' }));
        return;
    }

    if (lobby.hostID !== authenticatedUserID) {
        req.server.log.warn(`Unauthorized game start attempt by ${authenticatedUserID} in lobby ${lobbyID}. Real host: ${lobby.hostID}`);
        wsSend(socket, JSON.stringify({ error: 'not lobby host' }));
        return;
    }

    if (processGameRequest(fastify, gamePayload) === false) {
        req.server.log.error("processGameRequest failed: not enough players");
        wsSend(socket, JSON.stringify({ error: 'not enough players' }));
    }
}

export { handleGameRequest, handleLobbyRequest };