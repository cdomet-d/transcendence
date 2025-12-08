import { createVisualFeedback, redirectOnError } from '../error.js';
import { router } from '../main.js';
import { type gameRequest } from '../pong/pong.js';
import type { LocalPongSettings, RemotePongSettings } from '../web-elements/forms/pong-settings.js';
import type { inviteeObj } from './gm.interface.front.js';
import { executeAction } from './wsAction.front.js';

export let wsInstance: WebSocket | null = null;

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

		// TODO what happens if host leaves lobby, kick everyone ?
		executeAction(action, format, formInstance, lobbyID, gameSettings, invitee);
	}

	if (action === 'invitee' && ws.OPEN)//TODO: ws OPEN necessary ?
		setMessEvent(ws, form);

	executeAction(action, format, formInstance, lobbyID, gameSettings, invitee);

	ws.onerror = (err: any) => {
		console.log('Error:', err);
		return;
	};

	ws.onclose = (event) => {
		wsInstance = null;
		console.log('Lobby WebSocket connection closed!');
		if (event.code === 4001) {
			const currentRoute = window.location.pathname;
			if (currentRoute.includes("-lobby"))
				router.loadRoute('/lobby-menu', true);
		}
		// TODO KICK USER OUT OF LOBBY_MAP AND GM WS_CLIENT_MAP // 'delete' action ? Handle in GM?
		// TODO: Check wether deconnection was expected or not
	};
}

function setMessEvent(ws: WebSocket, form?: RemotePongSettings | LocalPongSettings) {
	ws.onmessage = (message: MessageEvent) => {
		try {
			const data = JSON.parse(message.data);
			if (data.error) {
				const error = data.error;
				if (error === 'not enough players') {
					createVisualFeedback('You do not have enough players in your lobby to start playing!', 'error');
				} else if (error === 'lobby not found') {
					createVisualFeedback('Your lobby is malfunctionning! Please create a new one!', 'error');
				} else if (error === 'lobby does not exist') {
					redirectOnError('/home', 'The lobby you are trying to join does not exist anymore!');
				}
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
			if (data.opponent && data.gameID && data.remote /* && data.gameSettings */) {
				const gameRequest: gameRequest = data;
				console.log("IN WS CONNECT GameRequest =>", gameRequest);
				router.loadRoute('/game', true, gameRequest); // TODO give usernames in gameRequest
				return;
			}
		} catch (error) {
			console.error("Error: Failed to parse WS message", error);
		}
	}
}

export { wsConnect };
