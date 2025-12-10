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

    if (action === 'invite') {
        // TODO prevent non-host from inviting people
        // get lobby from ID, check if host, allow invite if yes, else wsSend some error code
        wsSend(wsInstance!, await inviteToLobbyRequest(action, invitee!, format));
        return;
    }

    // reply Lobby Invite
    if (action === 'join') {
        wsSend(wsInstance!, joinLobbyRequest(action, format, invitee!, lobbyID!, formInstance));
        return;
    }

    if (action === 'decline') {
        wsSend(wsInstance!, declineLobbyRequest(action, invitee!, lobbyID!));
        return;
    }

    if (action === 'game') {
        wsSend(wsInstance!, await createGameRequest(format, formInstance, gameSettings!));
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
