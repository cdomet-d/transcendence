import { router, userStatus, type userStatusInfo } from '../main.js';
import { createGameRequest } from './gameRequest.front.js';
import { createLobbyRequest, joinLobbyRequest } from './lobbyRequest.front.js';
import { type gameRequest } from '../pong/pong.js';
import { redirectOnError } from '../error.js';
import type { LocalPongSettings, RemotePongSettings } from '../web-elements/forms/pong-settings.js';

interface inviteeObj {
	userID: string, 
	username?: string
}

let wsInstance: WebSocket | null = null;

function openWsConnection() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		return wsInstance;
	}
	wsInstance = new WebSocket('wss://localhost:8443/api/lobby/');
	return wsInstance;
}

async function wsConnect(action: string, format: string, formInstance: string, lobbyID?: string, gameSettings?: string, invitee?: inviteeObj, form?: RemotePongSettings | LocalPongSettings) {
	const ws: WebSocket = openWsConnection();
	if (form)
		form.socket = ws;

	ws.onopen = async () => {
		console.log('Lobby WebSocket connection established!')
		setMessEvent(ws, form);

		const interval = setInterval(() => {
			if (ws.readyState === ws.OPEN) {
				ws.send(JSON.stringify({ event: "NOTIF", payload: { notif: "ping" } }));
			} else clearInterval(interval);
		}, 30000);

		// send Lobby Request
		if (action === 'create') {
			if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
				wsInstance.send(await createLobbyRequest(action, format, formInstance));
			} else {
				console.log(`Error: WebSocket is not open for ${action}`);
			}
		}

		// TODO keep alive ws connection during whole tournament (until everyone leaves)
		// TODO what happens if host leaves lobby, kick everyone ?

		// reply Lobby Invite
		if (action === 'join') {
			if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
				wsInstance.send(await joinLobbyRequest(action, format, invitee!, lobbyID!, formInstance));
			} else {
				console.log(`Error: WebSocket is not open for ${action}`);
			}
		}
		decline(action, invitee!, lobbyID!);
	}

	if (action === 'invitee')
		setMessEvent(ws, form);

	if (action === 'game') {
		if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
			wsInstance.send(await createGameRequest(format, formInstance, gameSettings!));
		} else {
			console.log(`Error: WebSocket is not open for ${action}`);
		}
	}

	if (action === 'invite') {
		if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {

			const host: userStatusInfo = await userStatus();
			if (!host.auth || !host.userID) {
				redirectOnError('/auth', 'You must be registered to see this page')
			}

			// TODO prevent non-host from inviting people
			// get lobby from ID, check if host, allow invite if yes, else wsSend some error code
			console.log(`Form Instance ${formInstance}`);
			const _formInstance = formInstance === 'remote-pong-settings' ? 'remoteForm' : 'tournamentForm';
			wsInstance.send(JSON.stringify({ event: "LOBBY_INVITE", payload: { action: action, invitee: invitee, hostID: host.userID }, formInstance: _formInstance }));
		} else {
			console.log(`Error: WebSocket is not open for ${action}`);
		}
	}

	decline(action, invitee!, lobbyID!);

	ws.onerror = (err: any) => {
		console.log('Error:', err);
		return;
	};

	ws.onclose = () => {
		wsInstance = null;
		console.log('Lobby WebSocket connection closed!');
		// TODO KICK USER OUT OF LOBBY_MAP AND GM WS_CLIENT_MAP // 'delete' action ? Handle in GM?
		// TODO: Check wether deconnection was expected or not
	};
}

function setMessEvent(ws: WebSocket, form?: RemotePongSettings | LocalPongSettings) {
	ws.onmessage = (message: MessageEvent) => {
		try {
			// handle Response for lobbyRequest
			const data = JSON.parse(message.data);
			if (data.error) {
				console.log("ERROR: ", data.error);
				return;
			}
			if (data.event === "NOTIF" && data.notif === "pong") return;
			if (data.lobby) {
				console.log(`${data.lobby} lobby ${data.lobbyID} successfully!`);

				// TODO send host to front as soon as lobby 'created'
				// send lobbyID to Form
				// updateGameForm(data.formInstance);
				// TODO tell front when everybody there

				if (data.lobby === "joined") {
					// console.log("FORM INSTANCE OUAI", data.formInstance);
					if (data.formInstance === "1 vs 1") {
						router.loadRoute("/quick-remote-lobby", true, undefined, "invitee", data.whiteListUsernames);
						//fill lobby with data.whiteListUsers;
					}
					else if (data.formInstance === "tournament") {
						router.loadRoute("/tournament-lobby", true, undefined, "invitee", data.whiteListUsernames);
					}
				}
				if (data.lobby === "whiteListUpdate") {
					if (form === undefined)
						console.log("FORM UNDEFINED");
					form?.displayUpdatedGuests(data.whiteListUsernames);
				}
				return;
			}

			// handle Response for gameRequest
			const gameRequest: gameRequest = data;
			// verify gameRequest content before rendering PONG
			console.log("IN WS CONNECT GameRequest =>", gameRequest);
			router.loadRoute('/game', true, gameRequest); // TODO give usernames in gameRequest
		} catch (error) {
			console.error("Error: Failed to parse WS message", error);
		}
	}
}

function decline(action: string, invitee: inviteeObj, lobbyID: string) {
	if (action === 'decline') {
		if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
			wsInstance.send(JSON.stringify({ event: "LOBBY_INVITE", payload: { action: action, invitee: invitee, lobbyID: lobbyID } }));
		} else {
			console.log(`Error: WebSocket is not open for ${action}`);
		}
	}
}

export { wsConnect };
