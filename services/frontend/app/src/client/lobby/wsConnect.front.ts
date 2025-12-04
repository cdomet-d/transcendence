import { router, userStatus, type userStatusInfo } from '../main.js';
import { createGameRequest } from './gameRequest.front.js';
import { createLobbyRequest, joinLobbyRequest } from './lobbyRequest.front.js';
import { type gameRequest } from '../pong/pong.js';
import { redirectOnError } from '../error.js';

let wsInstance: WebSocket | null = null;

function openWsConnection() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		return wsInstance;
	}
	wsInstance = new WebSocket('wss://localhost:8443/api/lobby/');
	return wsInstance;
}

async function wsConnect(action: string, format: string, formInstance: string, lobbyID?: string, gameSettings?: string, inviteeID?: string) {
	const ws: WebSocket = openWsConnection();

	ws.onopen = async () => {
		console.log("Lobby WebSocket connection established!")
		// send Lobby Request
		console.log("1");
		if (action === 'create') {
			if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
				wsInstance.send(await createLobbyRequest(action, format, formInstance));
			} else {
				console.log(`Error: WebSocket is not open for ${action}`);
			}
		}

		// TODO keep alive ws connection during whole tournament (until everyone leaves)
		// TODO what happens if host leaves lobby, kick everyone ?

		if (action === 'decline') {
			if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
				wsInstance.send(JSON.stringify({ event: "LOBBY_REQUEST", payload: { action: action, inviteeID: inviteeID, lobbyID: lobbyID } }));
			} else {
				console.log(`Error: WebSocket is not open for ${action}`);
			}
		}

		if (action === 'join') {
			if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
				wsInstance.send(await joinLobbyRequest(action, format, inviteeID!, lobbyID!));
			} else {
				console.log(`Error: WebSocket is not open for ${action}`);
			}
		}
	}

	// send Game Request
	if (action === 'game') {
		if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
			wsInstance.send(await createGameRequest(format, formInstance, gameSettings!));
		} else {
			console.log(`Error: WebSocket is not open for ${action}`);
		}
	}

	// send Lobby Invites
	if (action === 'invite') {
		if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {

			const host: userStatusInfo = await userStatus();
			if (!host.auth || !host.userID) {
				redirectOnError('/auth', 'You must be registered to see this page')
			}

			// TODO prevent non-host from inviting people
			wsInstance.send(JSON.stringify({ event: "LOBBY_REQUEST", payload: { action: action, inviteeID: inviteeID, userID: host.userID } })); // 
		} else {
			console.log(`Error: WebSocket is not open for ${action}`);
		}
	}

	ws.onmessage = (message: MessageEvent) => {
		try {
			// handle Response for lobbyRequest
			const data = JSON.parse(message.data);
			if (data.lobby && (data.lobby === 'created' || data.lobby === 'joined')) {
				console.log(`${data.lobby} lobby ${data.lobbyID} successfully!`);

				// TODO send host to front as soon as lobby 'created'
				// formInstance.owner = 'username';

				// send lobbyID to Form
				console.log("Form instance: ", data.formInstance);
				// updateGameForm(data.formInstance);
				// TODO tell front when everybody there

				if (data.lobby === "joined") {
					// if (data.formInstance === 'remoteForm') {
						router.loadRoute('/quick-remote-lobby', true, undefined, "");
					// }
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

	ws.onerror = (err: any) => {
		console.log('Error:', err);
		return;
	};

	ws.onclose = () => {
		console.log('Lobby WebSocket connection closed!');
		// TODO KICK USER OUT OF LOBBY_MAP AND GM WS_CLIENT_MAP // 'delete' action ? Handle in GM?
		// TODO: Check wether deconnection was expected or not
	};
}

export { wsConnect };
