import { userDataFromAPIRes } from "../api-responses/user-responses";
import { createVisualFeedback, errorMessageFromException, exceptionFromResponse, redirectOnError } from "../error";
import { router } from "../main";
import type { gameRequest } from "../pong/pong";
import type { LocalPongSettings, RemotePongSettings } from "../web-elements/forms/pong-settings";
import { createBracket } from "../web-elements/game/pong-events";
import type { MatchParticipants, UserData } from "../web-elements/types-interfaces";
import { wsSend } from "./wsAction.front";

export function handleLobbyEvent(data: any, ws: WebSocket, form?: RemotePongSettings | LocalPongSettings): void {
    switch (data.lobby) {
        case 'created':
            console.log('Lobby created with ID:', data.lobbyID);
            if (form) {
                form.lobbyID = data.lobbyID;
            }
            break;
        case 'joined':
            handleLobbyJoined(data);
            break;
        case 'whiteListUpdate':
            handleWhiteListUpdate(data, form);
            break;
        case 'brackets':
            displayBrackets(data.brackets, ws);
            break;
        default:
            console.warn('Unhandled lobby event:', data.lobby);
    }
}

export function handleLobbyJoined(data: any): void {
    if (!Array.isArray(data.whiteListUsernames)) {
        console.error('Invalid whiteListUsernames format:', data.whiteListUsernames);
        createVisualFeedback('Invalid lobby data received. Please try again.', 'error');
        return;
    }

    if (data.format === "quickmatch") {
        router.loadRoute("/quick-remote-lobby", true, undefined, "invitee", data.whiteListUsernames);
    }
    else if (data.format === "tournament") {
        router.loadRoute("/tournament-lobby", true, undefined, "invitee", data.whiteListUsernames);
    }
    else {
        console.error('Invalid format received:', data.format);
        createVisualFeedback('Invalid lobby type received. Please try again.', 'error');
    }
}

export function handleWhiteListUpdate(data: any, form?: RemotePongSettings | LocalPongSettings): void {
    if (!form) {
        console.error('FORM UNDEFINED: Cannot update whitelist');
        return;
    }

    if (!Array.isArray(data.whiteListUsernames)) {
        console.error('Invalid whiteListUsernames in update:', data.whiteListUsernames);
        return;
    }

    form.displayUpdatedGuests(data.whiteListUsernames);
    form.disableStartButton();
}

export function handleGameStart(data: any, ws: WebSocket): void {
    if (!data.gameID || typeof data.gameID !== 'string') {
        console.error('Invalid gameID:', data.gameID);
        createVisualFeedback('Invalid game data received.', 'error');
        return;
    }

    if (!data.opponent || typeof data.opponent !== 'string') {
        console.error('Invalid opponent data:', data.opponent);
        createVisualFeedback('Invalid game data received.', 'error');
        return;
    }

    if (typeof data.remote !== 'boolean') {
        console.error('Invalid remote flag:', data.remote);
        createVisualFeedback('Invalid game data received.', 'error');
        return;
    }

    if (!data.gameSettings || typeof data.gameSettings !== 'object') {
        console.error('Invalid gameSettings:', data.gameSettings);
        createVisualFeedback('Invalid game data received.', 'error');
        return;
    }

    const gameRequest: gameRequest = data;
    router.loadRoute('/game', true, gameRequest, undefined, undefined, ws);
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
		wsSend(ws, (JSON.stringify({ event: "SIGNAL", payload: { signal: "got bracket" } })));
	}, 5000);
}

async function fetchTinyProfile(username: string): Promise<UserData | null> {
	const url = `https://${API_URL}:8443/api/bff/tiny-profile/${username}`;
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
