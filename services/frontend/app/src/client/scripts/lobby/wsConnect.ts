import { renderLobby } from '../../pages/html.pages.js';
import { pong } from '../game/pong.js';
import { router } from '../main.js';

let wsInstance: WebSocket | null = null;

function openWsConnection() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		return wsInstance;
	}
	wsInstance = new WebSocket('wss://localhost:8443/api/game/lobby');
	return wsInstance;
}

export function attachLobbyMenuListeners() {
	const createBtn = document.getElementById('create-btn');
	const joinBtn = document.getElementById('join-btn');

	if (createBtn) {
		createBtn.addEventListener('click', () => handleLobbyRequest("create"));
	}
	if (joinBtn) {
		joinBtn.addEventListener('click', () => handleLobbyRequest("join"));
	}
}

function attachLobbyListeners() {
	const startButton = document.getElementById('start-tournament-btn');

	if (startButton) {
		startButton.addEventListener('click', handleTournamentStart);
	}
}


function wsConnect() {
	const ws: WebSocket = openWsConnection();

	ws.onopen = () => {
		console.log("WebSocket connection established!")
		// enable buttons in html?
	}

	ws.onmessage = (message: MessageEvent) => {
		try {
			// console.log("Client received WS message!");

			// Filter incoming messages (mostly replies from GM)
			// Lobby: created OR join
			// GameRequest: approved OR declined

			const data = JSON.parse(message.data);
			if (data.lobby === "created" || data.lobby === "joined") { // CREATE OR JOIN, SAME STORY
				console.log("Lobby created, rendering lobby now")
				const app = document.getElementById('app');
				if (app) {
					app.innerHTML = renderLobby();
					attachLobbyListeners();
				} else {
					console.log("Error: could not find HTMLElement: 'app'");
					return;
				}
			}

			// TODO: check for empty obj
			const gameRequest/* : gameRequest */ = data;
			const gameID: number = gameRequest.gameID;
			if (gameRequest.event === "declined") { // REQUEST DECLINED
				console.log("Error: Failed to start game: #" + gameID);
				return;
			} else if (gameRequest.event === "approved") { // REQUEST APPROVED
				window.history.pushState({}, '', '/game/match');
				router._loadRoute('/game/match');
				console.log("Client ready to connect game: #" + gameID);
				pong(message.data); // ws connect to "/game/match" and send userID + gameID
			}
		} catch (error) {
			console.error("Error: Failed to parse WS message", error);
		}
	}

	ws.onerror = (err: any) => {
		console.log("error:", err);
		return; //TODO: handle error properly
	}

	ws.onclose = () => {
		console.log("WebSocket connection closed!");
		// TODO: Check wether deconnection was expected or not 
	}
}

function handleTournamentStart() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		const message = createGameRequestForm();
		console.log("Client sending REQUEST_FORM to GM:\n", message);
		wsInstance.send(message);
	} else {
		console.log("Error: WebSocket is not open for REQUEST_FORM");
	}
}

function handleLobbyRequest(action: string): void {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		console.log(`Client sending ${action} request`);
		wsInstance.send(createLobbyRequestForm(action));
	} else {
		console.log(`Error: WebSocket is not open for ${action}`);
	}
}

// TODO: requestForm should be filled with lobbyInfo
function createGameRequestForm(): string {
	const requestForm = {
		event: "TOURNAMENT_REQUEST",
		payload: {
			format: "tournament",
			remote: "true",
			players: "4",
			users: [
				{ userID: 1, username: "sam" },
				{ userID: 2, username: "alex" },
				{ userID: 3, username: "cha" },
				{ userID: 4, username: "coco" }
			]
		}
	};

	return JSON.stringify(requestForm);
}

interface lobbyForm {
	event: "LOBBY_REQUEST",
	payload: {
		action: "create" | "join" | string, // | string is for type compatibility
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

export { wsConnect };