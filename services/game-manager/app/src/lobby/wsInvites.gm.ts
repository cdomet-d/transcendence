import type { FastifyInstance, FastifyRequest } from "fastify";
import type { gameNotif, lobbyInviteForm } from "./lobby.interface.js";
import { informHostToStart, wsSend } from "./wsHandler.gm.js";
import { addUserToLobby, addUserToWhitelist, findLobbyIDFromUserID, getWhiteListUsernames, lobbyMap, removeUserFromLobby, removeUserFromWhitelist } from "./lobby.gm.js";
import { addNotifToDB, removeNotifFromDB } from "../inviteNotifs/invite-notifs.js";
import { natsPublish } from "../nats/publisher.gm.js";

function handleInviteAction(fastify: FastifyInstance, invitePayload: lobbyInviteForm, authenticatedUserID: string, socket: WebSocket, req: FastifyRequest): void {
    const lobbyID = findLobbyIDFromUserID(authenticatedUserID);
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
        req.server.log.warn(`Unauthorized invite attempt by ${authenticatedUserID} in lobby ${lobbyID}. Real host: ${lobby.hostID}`);
        wsSend(socket, JSON.stringify({ error: 'not lobby host' }));
        return;
    }

    if (!invitePayload.invitee?.userID) {
        wsSend(socket, JSON.stringify({ error: 'invalid invitee' }));
        return;
    }

    const hostUsername = lobby.userList.get(authenticatedUserID)?.username;
    if (!hostUsername) {
        req.server.log.error(`Host ${authenticatedUserID} not found in lobby ${lobbyID} userList`);
        wsSend(socket, JSON.stringify({ error: 'host data corrupted' }));
        return;
    }

    const inviteeID = invitePayload.invitee.userID!;
    const notif: gameNotif = {
        type: 'GAME_INVITE',
        senderUsername: hostUsername,
        receiverID: inviteeID,
        lobbyID: lobbyID!,
        gameType: invitePayload.format! === 'quickmatch' ? '1 vs 1' : 'tournament'
    };
    addNotifToDB(fastify, notif);
    addUserToWhitelist(invitePayload.invitee, lobbyID!);
    natsPublish(fastify, 'post.notif', JSON.stringify(notif));
}

function handleDeclineAction(fastify: FastifyInstance, invitePayload: lobbyInviteForm, authenticatedUserID: string, socket: WebSocket, req: FastifyRequest): void {
    const inviteeID = invitePayload.invitee.userID!;
    if (inviteeID !== authenticatedUserID) {
        req.server.log.warn(`User ${authenticatedUserID} tried to decline invite for ${inviteeID}`);
        wsSend(socket, JSON.stringify({ error: 'Unauthorized' }));
        return;
    }
    removeNotifFromDB(fastify, invitePayload.lobbyID!, inviteeID);
    removeUserFromWhitelist(inviteeID, invitePayload.lobbyID!);
    if (findLobbyIDFromUserID(inviteeID) === null)
        socket.close();
}

function handleJoinAction(invitePayload: lobbyInviteForm, authenticatedUserID: string, authenticatedUsername: string, socket: WebSocket, req: FastifyRequest, fastify: FastifyInstance): void {
    if (invitePayload.invitee.userID !== authenticatedUserID) {
        req.server.log.warn(`User ${authenticatedUserID} tried to join as ${invitePayload.invitee.userID}`);
        wsSend(socket, JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    if (!lobbyMap.has(invitePayload.lobbyID!)) {
        wsSend(socket, JSON.stringify({ error: 'lobby does not exist' }));
        removeNotifFromDB(fastify, invitePayload.lobbyID!, invitePayload.invitee.userID);
        if (findLobbyIDFromUserID(invitePayload.invitee.userID) === null)
            socket.close();
    }
    let oldLobby: string | undefined = findLobbyIDFromUserID(authenticatedUserID);
    if (oldLobby !== undefined && oldLobby !== invitePayload.lobbyID!)
        removeUserFromLobby(authenticatedUserID, oldLobby, 0);
    removeNotifFromDB(fastify, invitePayload.lobbyID!, authenticatedUserID);
    addUserToLobby(authenticatedUserID!, authenticatedUsername, socket, invitePayload.lobbyID!);
    const whiteListUsernames: string[] = getWhiteListUsernames(invitePayload.lobbyID!)
    informHostToStart(fastify, socket, invitePayload.lobbyID!);
    wsSend(socket, JSON.stringify({ 
        lobby: 'joined', 
        lobbyID: invitePayload.lobbyID, 
        whiteListUsernames: whiteListUsernames, 
        format: lobbyMap.get(invitePayload.lobbyID!)?.format 
    }));
}

export { handleDeclineAction, handleInviteAction, handleJoinAction };