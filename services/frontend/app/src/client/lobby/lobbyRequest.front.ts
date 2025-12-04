import { redirectOnError } from "../error";
import { userStatus, type userStatusInfo } from "../main";
import type { lobbyRequestForm } from "./gm.interface.front";

async function createLobbyRequest(action: string, format: string, formInstance?: string): Promise<string> {
		console.log("2");

    const host: userStatusInfo = await userStatus();
    if (!host.auth) {
        redirectOnError('/auth', 'You must be registered to see this page')
        return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    }

    const createLobbyForm: lobbyRequestForm = {
        event: 'LOBBY_REQUEST',
        payload: {
            action: action,
            format: format,
            userID: host.userID!,
        },
        formInstance: formInstance
    };

    return JSON.stringify(createLobbyForm);
}

async function joinLobbyRequest(action: string, format: string, inviteeID: string, lobbyID: string) {

    const joinLobbyForm: lobbyRequestForm = {
        event: 'LOBBY_REQUEST',
        payload: {
            action: action,
            format: format,
            userID: inviteeID,
            lobbyID: lobbyID,
        },
        // formInstance: formInstance
    };

    return JSON.stringify(joinLobbyForm);
}

export { createLobbyRequest, joinLobbyRequest };