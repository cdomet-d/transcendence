import { redirectOnError } from "../error";
import { userStatus, type userStatusInfo } from "../main";
import { createGameRequest } from "./gameRequest.front";
import type { inviteeObj } from "./gm.interface.front";
import { createLobbyRequest, declineLobbyRequest, inviteToLobbyRequest, joinLobbyRequest } from "./lobbyRequest.front";
import { wsInstance } from "./wsConnect.front";

export async function executeAction(action: string, format: string, formInstance: string, lobbyID?: string, gameSettings?: string, invitee?: inviteeObj) {
    // send Lobby Request
    if (action === 'create') {
        wsSend(wsInstance!, await createLobbyRequest(action, format, formInstance));
        return;
    }

    if (action === 'game') {
        wsSend(wsInstance!, await createGameRequest(format, formInstance, gameSettings!));
        return;
    }

    if (action === 'invite') {
        const host: userStatusInfo = await userStatus();
        if (!host.auth || !host.userID) {
            redirectOnError('/auth', 'You must be registered to see this page')
        }
        // TODO prevent non-host from inviting people
        // get lobby from ID, check if host, allow invite if yes, else wsSend some error code
        console.log(`Form Instance ${formInstance}`);
        // const _formInstance = formInstance === 'remote-pong-settings' ? 'remoteForm' : 'tournamentForm';
        // wsSend(wsInstance!, JSON.stringify({ event: "LOBBY_INVITE", payload: { action: action, invitee: invitee, hostID: host.userID }, formInstance: _formInstance }));
        
        wsSend(wsInstance!, inviteToLobbyRequest(action, invitee!, host.userID!, formInstance));
        return;
    }

    // reply Lobby Invite
    if (action === 'join') {
        wsSend(wsInstance!, await joinLobbyRequest(action, format, invitee!, lobbyID!, formInstance));
        return;
    }

    if (action === 'decline') {
        wsSend(wsInstance!, await declineLobbyRequest(action, invitee!, lobbyID!));
        return;
    }

}

export function wsSend(ws: WebSocket, message: string): void {
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(message);
    } else {
        const payload = JSON.parse(message);
        console.log(`Error: Connection for userID < ${payload.userID} > not found or not open...`);
        console.log(`\tCould not start game with gameID < ${payload.gameID} > `);
    }
}
