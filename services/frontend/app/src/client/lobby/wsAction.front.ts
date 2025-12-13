import { createVisualFeedback } from "../error";
import { defaultDictionary } from "../web-elements/forms/language";
import { createGameRequest } from "./gameRequest.front";
import type { inviteeObj } from "./gm.interface.front";
import { createLobbyRequest, declineLobbyRequest, inviteToLobbyRequest, joinLobbyRequest } from "./lobbyRequest.front";

export async function executeAction(ws: WebSocket, action: string, format: string, formInstance: string, lobbyID?: string, gameSettings?: string, invitee?: inviteeObj) {
    // send Lobby Request
    if (action === 'create') {
        wsSend(ws, await createLobbyRequest(action, format));
        return;
    }

    if (action === 'invite') {
        wsSend(ws, await inviteToLobbyRequest(action, invitee!, format));
        return;
    }

    // reply Lobby Invite
    if (action === 'join') {
        wsSend(ws, joinLobbyRequest(action, format, invitee!, lobbyID!));
        return;
    }

    if (action === 'decline') {
        wsSend(ws, declineLobbyRequest(action, invitee!, lobbyID!));
        return;
    }

    if (action === 'game') {
        wsSend(ws, await createGameRequest(format, formInstance, gameSettings!, lobbyID!));
        return;
    }
}

export function wsSend(ws: WebSocket, message: string): void {
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(message);
    } else {
        createVisualFeedback(defaultDictionary.error.ws_closed, "error");
    }
}
