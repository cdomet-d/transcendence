import type { FastifyInstance, FastifyRequest } from "fastify";
import type { gameNotif, lobbyInviteForm } from "./lobby.interface.js";
import { wsSend } from "./wsHandler.gm.js";
import { addUserToLobby, addUserToWhitelist, findLobbyIDFromUserID, getWhiteListUsernames, lobbyMap, removeUserFromLobby, removeUserFromWhitelist } from "./lobby.gm.js";
import { addNotifToDB, removeNotifFromDB } from "../inviteNotifs/invite-notifs.js";
import { natsPublish } from "../nats/publisher.gm.js";

function handleInviteAction(fastify: FastifyInstance, invitePayload: lobbyInviteForm, authenticatedUserID: string, formInstance: string, socket: WebSocket, req: FastifyRequest): void {
    if (invitePayload.hostID !== authenticatedUserID) {
        req.server.log.warn(`Unauthorized invite attempt by ${authenticatedUserID}`);
        wsSend(socket, JSON.stringify({ error: 'not lobby host' }));
        return;
    }

    const lobbyID = findLobbyIDFromUserID(authenticatedUserID);
    if (lobbyID === null) {
        wsSend(socket, JSON.stringify({ error: 'lobby not found' }));
        return;
    }

    const hostUsername = lobbyMap.get(lobbyID)?.userList.get(authenticatedUserID)?.username!;
    const notif: gameNotif = {
        type: 'GAME_INVITE',
        senderUsername: hostUsername,
        receiverID: invitePayload.invitee.userID!,
        lobbyID: lobbyID,
        gameType: formInstance === 'remoteForm' ? '1 vs 1' : 'tournament'
    };

    addNotifToDB(fastify, notif);
    addUserToWhitelist(invitePayload.invitee, lobbyID);
    natsPublish(fastify, 'post.notif', JSON.stringify(notif));
}

function handleDeclineAction(fastify: FastifyInstance, invitePayload: lobbyInviteForm, authenticatedUserID: string, socket: WebSocket, req: FastifyRequest): void {
    const inviteeID = invitePayload.invitee.userID!;

    if (inviteeID !== authenticatedUserID) {
        req.server.log.warn(`User ${authenticatedUserID} tried to decline invite for ${inviteeID}`);
        wsSend(socket, JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    removeNotifFromDB(fastify, invitePayload.lobbyID!, authenticatedUserID);
    removeUserFromWhitelist(authenticatedUserID, invitePayload.lobbyID!);

    if (findLobbyIDFromUserID(authenticatedUserID) === null) {
        socket.close();
    }
}

function handleJoinAction(invitePayload: lobbyInviteForm, authenticatedUserID: string, authenticatedUsername: string, formInstance: string, socket: WebSocket, req: FastifyRequest, fastify: FastifyInstance): void {
    if (invitePayload.invitee.userID !== authenticatedUserID) {
        req.server.log.warn(`User ${authenticatedUserID} tried to join as ${invitePayload.invitee.userID}`);
        wsSend(socket, JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    if (!lobbyMap.has(invitePayload.lobbyID!)) {
        wsSend(socket, JSON.stringify({ error: 'lobby does not exist' }));
        return;
    }

    const oldLobby = findLobbyIDFromUserID(authenticatedUserID);
    if (oldLobby !== null) {
        removeUserFromLobby(authenticatedUserID, oldLobby);
    }

    removeNotifFromDB(fastify, invitePayload.lobbyID!, authenticatedUserID);
    addUserToLobby(authenticatedUserID, authenticatedUsername, socket, invitePayload.lobbyID!);
    const whiteListUsernames = getWhiteListUsernames(invitePayload.lobbyID!);

    wsSend(socket, JSON.stringify({
        lobby: 'joined',
        lobbyID: invitePayload.lobbyID,
        formInstance: formInstance,
        whiteListUsernames: whiteListUsernames
    }));
}

export { handleDeclineAction, handleInviteAction, handleJoinAction };