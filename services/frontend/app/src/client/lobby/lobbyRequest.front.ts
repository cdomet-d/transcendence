import { redirectOnError } from "../error";
import { userStatus, type userStatusInfo } from "../main";
import type { inviteeObj, lobbyInviteForm, lobbyRequestForm } from "./gm.interface.front";

async function createLobbyRequest(action: string, format: string, formInstance?: string): Promise<string> {
	const host: userStatusInfo = await userStatus();
	if (!host.auth) {
		redirectOnError('/auth', 'You must be registered to see this page');
		return JSON.stringify({ event: 'BAD_USER_TOKEN' });
	}

	const createLobbyForm: lobbyRequestForm = {
		event: 'LOBBY_REQUEST',
		payload: { action: action, format: format, userID: host.userID!, username: host.username! },
		formInstance: formInstance,
	};
	
	return JSON.stringify(createLobbyForm);
}

async function inviteToLobbyRequest(action: string, invitee: inviteeObj, formInstance: string) {
	const host: userStatusInfo = await userStatus();
	if (!host.auth || !host.userID) {
		redirectOnError('/auth', 'You must be registered to see this page');
		return JSON.stringify({ event: 'BAD_USER_TOKEN' });
	}

	const inviteToLobbyForm: lobbyInviteForm = {
		event: 'LOBBY_INVITE',
		payload: {
			action: action,
			invitee: invitee,
			hostID: host.userID,
		},
		formInstance: formInstance === 'remote-pong-settings' ? 'remoteForm' : 'tournamentForm'
	};
	return JSON.stringify(inviteToLobbyForm);
}

function joinLobbyRequest(action: string, format: string, invitee: { userID: string, username?: string }, lobbyID: string, formInstance: string) {
	const joinLobbyForm: lobbyInviteForm = {
		event: 'LOBBY_INVITE',
		payload: {
			action: action,
			format: format,
			invitee: invitee,
			lobbyID: lobbyID,
		},
		formInstance: formInstance
	};
	return JSON.stringify(joinLobbyForm);
}

function declineLobbyRequest(action: string, invitee: inviteeObj, lobbyID: string) {
	const declineLobbyForm: lobbyInviteForm = {
		event: 'LOBBY_INVITE',
		payload: {
			action: action,
			invitee: invitee,
			lobbyID: lobbyID,
		}
	};
	return JSON.stringify(declineLobbyForm);
}

export { createLobbyRequest, joinLobbyRequest, declineLobbyRequest, inviteToLobbyRequest };
