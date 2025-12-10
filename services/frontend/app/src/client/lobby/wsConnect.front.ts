import { createVisualFeedback, errorMessageFromException, exceptionFromResponse, redirectOnError } from '../error.js';
import { router, userStatus } from '../main.js';
import { type gameRequest } from '../pong/pong.js';
import type { LocalPongSettings, RemotePongSettings } from '../web-elements/forms/pong-settings.js';
import { origin } from '../main.js'
import type { inviteeObj } from './gm.interface.front.js';
import { executeAction, wsSend } from './wsAction.front.js';
import { createBracket, endGame } from '../web-elements/game/pong-events.js';
import { looseImage, winImage } from '../web-elements/default-values.js';
import type { MatchParticipants, UserData } from '../web-elements/types-interfaces.js';
import { userDataFromAPIRes } from '../api-responses/user-responses.js';

export let wsInstance: WebSocket | null = null;

function openWsConnection() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		return wsInstance;
	}
	wsInstance = new WebSocket(`wss://${origin}:8443/api/lobby/`);
	return wsInstance;
}

async function wsConnect(action: string, format: string, formInstance: string, lobbyID?: string, gameSettings?: string, invitee?: inviteeObj, form?: RemotePongSettings | LocalPongSettings) {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN)
		executeAction(wsInstance, action, format, formInstance, lobbyID, gameSettings, invitee);
	let ws: WebSocket;
	if (wsInstance === null) {
		ws = openWsConnection();
		setMessEvent(ws, form);
	}
	else
		ws = wsInstance;
	console.log("WS ID:", ws);
	if (form)
		form.socket = ws;
	ws.onopen = async () => {
		console.log('Lobby WebSocket connection established!')

		// setMessEvent(ws, form);

		const interval = setInterval(() => {
			if (ws.readyState === ws.OPEN) {
				ws.send(JSON.stringify({ event: "NOTIF", payload: { notif: "ping" } }));
			} else clearInterval(interval);
		}, 30000);

		// TODO what happens if host leaves lobby, kick everyone ?
		executeAction(ws, action, format, formInstance, lobbyID, gameSettings, invitee);
	}

	if (action === 'invitee' && ws.readyState === WebSocket.OPEN) {
		setMessEvent(ws, form);
		wsSend(ws, (JSON.stringify({ event: "SIGNAL", payload: { signal: "in lobby" } })));
	}

	ws.onerror = (err: any) => {
		console.log('Error:', err);
		return;
	};

	ws.onclose = (event) => {
		wsInstance = null;
		console.log('Lobby WebSocket connection closed!');
		if (event.code === 4001) {
			const currentRoute = window.location.pathname;
			if (currentRoute.includes("-lobby") || currentRoute === "/game")
				router.loadRoute('/lobby-menu', true);
		}
		// TODO KICK USER OUT OF LOBBY_MAP AND GM WS_CLIENT_MAP // 'delete' action ? Handle in GM?
		// TODO: Check wether deconnection was expected or not
	};
}

async function setMessEvent(ws: WebSocket, form?: RemotePongSettings | LocalPongSettings, ) {
	const user = await userStatus();
	if (user.auth === false)
		redirectOnError('/auth', 'Redirected: Failed to recover user'), null;
	ws.onmessage = (message: MessageEvent) => {
		try {
			const data = JSON.parse(message.data);
			console.log("data:", JSON.stringify(data))
			if (data === "start") {
				form?.enableStartButton();
				return;
			}

			if (data.event === "END GAME") {
				if (data.result === "winner")
					endGame(winImage, "winScreen", `${user.username!} won !`, data.endLobby);
				else
					endGame(looseImage, "looseScreen", `${user.username!} lost...`, data.endLobby);
				wsSend(ws, (JSON.stringify({ event: "SIGNAL", payload: { signal: "got result" } })));
			}

			if (data.error) {
				const error = data.error;
				if (error === 'not enough players') {
					createVisualFeedback('You do not have enough players in your lobby to start playing!', 'error');
				} else if (error === 'lobby not found') {
					createVisualFeedback('Your lobby is malfunctionning! Please create a new one!', 'error');
				} else if (error === 'lobby does not exist') {
					redirectOnError('/home', 'The lobby you are trying to join does not exist anymore!');
				} else if (error === 'not invited') {
					createVisualFeedback('You were not invited to this lobby!', 'error');
				}
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
					console.log("format:", data.format);
					if (data.format === "quickmatch") {
						router.loadRoute("/quick-remote-lobby", true, undefined, "invitee", data.whiteListUsernames);
					}
					else if (data.format === "tournament") {
						router.loadRoute("/tournament-lobby", true, undefined, "invitee", data.whiteListUsernames);
					}
				}
				if (data.lobby === "whiteListUpdate") {
					if (form === undefined) {
						console.log("FORM UNDEFINED");
						return;
					}
					form!.displayUpdatedGuests(data.whiteListUsernames);
				}
				if (data.lobby === "brackets") {
					createMatchParticipants(data.brackets);
				}
				return;
			}

			// handle Response for gameRequest
			if (data.opponent && data.gameID && (data.remote === true || data.remote === false) && data.gameSettings) {
				const gameRequest: gameRequest = data;
				router.loadRoute('/game', true, gameRequest, undefined, undefined, ws);
				return;
			}
		} catch (error) {
			console.error("Error: Failed to parse WS message", error);
		}
	}
}

async function createMatchParticipants(brackets: [string, string][]) {
	let tournament: MatchParticipants[] = [];
	let player1: UserData | null = null;
	let player2: UserData | null = null;
	for (const bracket of brackets) {
		player1 = await fetchTinyProfile(bracket[0]);
		player2 = await fetchTinyProfile(bracket[1]);
		if (!player1 || !player2)
			return;//TODO
		tournament.push({player1, player2});
	}
	console.log(JSON.stringify(tournament));
	createBracket(tournament);
}

async function fetchTinyProfile(username: string): Promise<UserData | null> {
	const url = `https://${origin}:8443/api/bff/tiny-profile/${username}`;
	try {
		const raw = await fetch(url, { credentials: 'include' });
		if (!raw.ok) {
			if (raw.status === 404) throw redirectOnError('/404', 'No such user');
			else throw await exceptionFromResponse(raw);
		}
		const data = await raw.json();
		const user = userDataFromAPIRes(data);
		return user;
	} catch (error) {
		console.error(errorMessageFromException(error));
		redirectOnError(router.stepBefore, errorMessageFromException(error));
	}
	return null;
}

export { wsConnect };
