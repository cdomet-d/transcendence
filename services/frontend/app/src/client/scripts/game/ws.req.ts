import { startGame } from './game.loop.js';
import { Game } from './game.class.js';

function wsRequest(game: Game, gameRequest: string) {
	const ws = new WebSocket('wss://localhost:8443/api/game/match');

	ws.onerror = (err) => {
		console.log("error:", err);
		return; //TODO: handle error properly
	}

	ws.onopen = () => {
		console.log("WebSocket connection established!")

		// HERE send gameRequest
		if (ws && ws.readyState === ws.OPEN) {
			ws.send(gameRequest); //TODO: only for testing
		}
	}

	ws.addEventListener('message', (event) => {
		const signal = Number(event.data);
		if (signal === 1)
			startGame(game, ws);
	}, { once: true });

	//TODO: on close ?
}

export { wsRequest };
