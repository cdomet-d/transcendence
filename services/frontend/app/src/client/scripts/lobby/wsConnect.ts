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
		createBtn.addEventListener('click', handleCreate);
	}
	if (joinBtn) {
		joinBtn.addEventListener('click', handleJoin);
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
			// Filter incoming messages

			// CREATE LOBBY
			const data = JSON.parse(message.data);
			if (data.lobby === "created") {
				console.log("Lobby created, rendering lobby now")
				const app = document.getElementById('app');
				if (app) {
					app.innerHTML = renderLobby();
					attachLobbyListeners();
				} else {
					console.log("Error: could not find HTMLElement: 'app'");
				}
			}
			// JOIN LOBBY

			// REQUEST APPROVED
			// REQUEST DECLINED

			// console.log("Client received WS message!");

			const gameRequest/* : gameRequest */ = JSON.parse(message.data);
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
		const message = createRequestForm();
		console.log("Client sending REQUEST_FORM to GM:\n", message);
		wsInstance.send(message);
	} else {
		console.log("Error: WebSocket is not open for REQUEST_FORM");
	}
}

function handleCreate() {
	if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
		const message: string = makeCreateLobbyRequest();
		console.log("Client sending CREATE request:\n", message);
		wsInstance.send(message);
	} else {
		console.log("Error: WebSocket is not open for CREATE");
	}
}

function handleJoin() {
	console.log("JOIN");

	// if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
	//     const joinMessage = makeJoinLobbyRequest();
	//     console.log("Client sending JOIN request:\n", joinMessage);
	//     wsInstance.send(joinMessage);
	//   } else {
	//     console.log("Error: WebSocket is not open for JOIN");
	//   }
}

function makeCreateLobbyRequest(): string {
	const message = {
		action: "create"
	};

	return JSON.stringify(message);
}

// TODO: requestForm should be filled with lobbyInfo
function createRequestForm(): string {
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

export { wsConnect };