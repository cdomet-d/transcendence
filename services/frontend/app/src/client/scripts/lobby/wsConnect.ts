import { renderLobby } from '../../pages/html.pages.js';
import { pong } from '../game/pong.js';
import { router } from '../main.js';
import { createGameRequestForm, createLobbyRequestForm, attachTournamentListener } from './lobby.js';

let wsInstance: WebSocket | null = null;

function openWsConnection() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		return wsInstance;
	}
	wsInstance = new WebSocket('wss://localhost:8443/api/game/lobby');
	return wsInstance;
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

			// Lobby
			const data = JSON.parse(message.data);
			if (data.lobby === "created" || data.lobby === "joined") { // CREATE OR JOIN, SAME STORY
				console.log(data.lobby, " lobby successfully!")

				const app = document.getElementById('app');
				if (app) {
					app.innerHTML = renderLobby();
					attachTournamentListener();
				} else {
					console.log("Error: could not find HTMLElement: 'app'");
					return;
				}
				return;
			}

			// GameRequest
			const gameRequest = data;
			const gameID: number = gameRequest.gameID;
			if (gameRequest.event === "declined") {
				console.log("Error: Failed to start game: #" + gameID);
				return;
			} else if (gameRequest.event === "approved") {
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

function handleLobbyRequest(action: string, format: string): void {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		console.log(`Client sending ${action} request`);
		wsInstance.send(createLobbyRequestForm(action, format));
	} else {
		console.log(`Error: WebSocket is not open for ${action}`);
	}
}

export { wsConnect, handleLobbyRequest, handleTournamentStart };