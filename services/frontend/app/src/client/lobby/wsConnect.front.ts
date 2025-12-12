import { createVisualFeedback, errorMessageFromException, exceptionFromResponse, redirectOnError } from '../error.js';
import { router, userStatus } from '../main.js';
import { type gameRequest } from '../pong/pong.js';
import type { LocalPongSettings, RemotePongSettings } from '../web-elements/forms/pong-settings.js';
import type { inviteeObj } from './gm.interface.front.js';
import { executeAction, wsSend } from './wsAction.front.js';
import { createBracket, endGame } from '../web-elements/game/pong-events.js';
import { looseImage, winImage } from '../web-elements/default-values.js';
import type { MatchParticipants, UserData } from '../web-elements/types-interfaces.js';
import { userDataFromAPIRes } from '../api-responses/user-responses.js';
import { currentDictionary } from '../web-elements/forms/language.js';


export let wsInstance: WebSocket | null = null;

function openWsConnection() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		return wsInstance;
	}
	wsInstance = new WebSocket(`wss://${API_URL}:8443/api/lobby/`);
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

async function setMessEvent(ws: WebSocket, form?: RemotePongSettings | LocalPongSettings) {
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
					endGame(winImage, "winScreen", `${data.username} won !`, data.endLobby);
				else
					endGame(looseImage, "looseScreen", `${data.username} lost...`, data.endLobby);
				if (data.endGame === true)
					wsSend(ws, (JSON.stringify({ event: "SIGNAL", payload: { signal: "got result" } })));
				else
					setTimeout(() => {
						console.log("in end game callback timer")
						wsSend(ws, (JSON.stringify({ event: "SIGNAL", payload: { signal: "got result" } })));
					}, 5000);
			}

			if (data.error) {
				const error = data.error;
				if (error === 'not enough players') {
					createVisualFeedback(currentDictionary.error.nbplayers_lobby, 'error');
				} else if (error === 'lobby not found') {
					createVisualFeedback(currentDictionary.error.broke_lobby, 'error');
				} else if (error === 'lobby does not exist') {
					redirectOnError('/home', currentDictionary.error.deleted_lobby);
				} else if (error === 'not invited') {
					createVisualFeedback(currentDictionary.error.invite_lobby, 'error');
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
					form!.disableStartButton();
				}
				if (data.lobby === "brackets")
					displayBrackets(data.brackets, ws);
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

async function displayBrackets(brackets: [string, string][], ws: WebSocket) {
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
	createBracket(tournament);
	setTimeout(() => {
		console.log("in brackets callback timer")
		wsSend(ws, (JSON.stringify({ event: "SIGNAL", payload: { signal: "got bracket" } })));
	}, 5000);
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
