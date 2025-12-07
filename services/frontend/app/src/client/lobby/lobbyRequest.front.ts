import { redirectOnError } from "../error";
import { userStatus, type userStatusInfo } from "../main";
import type { lobbyInviteForm, lobbyRequestForm } from "./gm.interface.front";

async function createLobbyRequest(action: string, format: string, formInstance?: string): Promise<string> {
    const host: userStatusInfo = await userStatus();
    if (!host.auth) {
        redirectOnError('/auth', 'You must be registered to see this page')
        return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    }

	const createLobbyForm: lobbyRequestForm = {
		event: 'LOBBY_REQUEST',
		payload: { action: action, format: format, userID: host.userID! },
		formInstance: formInstance,
	};

	return JSON.stringify(createLobbyForm);
}

async function joinLobbyRequest(action: string, format: string, inviteeID: string, lobbyID: string, formInstance: string) {

    const joinLobbyForm: lobbyInviteForm = {
        event: 'LOBBY_INVITE',
        payload: {
            action: action,
            format: format,
            inviteeID: inviteeID,
            lobbyID: lobbyID,
        },
        formInstance: formInstance
    };
	return JSON.stringify(joinLobbyForm);
}

export { createLobbyRequest, joinLobbyRequest };
