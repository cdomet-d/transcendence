import { renderLobbyMenu } from "../../pages/html.pages.js";
import { handleTournamentStart, handleLobbyRequest } from "./wsConnect.js";

interface lobbyInfo {
	remote: boolean,
	format: "quick" | "tournament",
	userList: userInfo[],
	players: number
	// gameSettings: gameSettingsObj
}

interface userInfo {
	userID?: number,
	username?: string,
	userSocket?: WebSocket
}


function lobby() {
	renderLobbyMenu();
	attachLobbyMenuListeners();
	import("./wsConnect.js").then(({ wsConnect }) => {
		wsConnect();
	})
}

function attachLobbyMenuListeners() {
	const createBtn = document.getElementById('create-btn');
	const joinBtn = document.getElementById('join-btn');

	if (createBtn) {
		createBtn.addEventListener('click', () => handleLobbyRequest("create"));
	}
	if (joinBtn) {
		joinBtn.addEventListener('click', () => handleLobbyRequest("join"));
	}
}

function attachTournamentListener() {
	const startButton = document.getElementById('start-tournament-btn');

	if (startButton) {
		startButton.addEventListener('click', handleTournamentStart);
	}
}

interface gameRequestForm {
	event: "TOURNAMENT_REQUEST" | "GAME_REQUEST",
	payload: lobbyInfo
}

// TODO: gameRequestForm 's payload is basically lobbyInfo
function createGameRequestForm(): string {
	const gameRequestForm: gameRequestForm = {
		event: "TOURNAMENT_REQUEST",
		payload: {
			format: "tournament",
			remote: true,
			players: 4,
			userList: [
				{ userID: 1, username: "sam" },
				{ userID: 2, username: "alex" },
				{ userID: 3, username: "cha" },
				{ userID: 4, username: "coco" }
			]
		}
	};

	return JSON.stringify(gameRequestForm);
}

interface lobbyForm {
	event: "LOBBY_REQUEST",
	payload: {
		action: "create" | "join" | string, // '| string' is for type compatibility
		lobbyID?: number,
		userID?: number
	}
}

function createLobbyRequestForm(action: string): string {
	const lobbyForm: lobbyForm = {
		event: "LOBBY_REQUEST",
		payload: {
			action: action,
			lobbyID: 1// TODO: invitation would contain lobbyID
			// userID: , // TODO: how to retrieve uid here (GM creates UIDs lol)
		}
	}
	return JSON.stringify(lobbyForm);
}

export { createGameRequestForm, createLobbyRequestForm, lobby, handleTournamentStart, attachTournamentListener }