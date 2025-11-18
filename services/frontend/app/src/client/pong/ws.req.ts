import { startGame } from './game.loop.js';
import { Game } from './classes/game.class.js';
import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./game.events.js";
import { renderGame } from "./game.render.utils.js";

export function wsRequest(game: Game, ids: {gameID: number, userID: number}) {
	const ws = new WebSocket('wss://localhost:8443/api/game/'); //?gameID=1');

    ws.onerror = (err) => {
        console.log('error:', err);
        return; //TODO: handle error properly
    };

	ws.onopen = () => {
		console.log("PONG webSocket connection established!");
		ws.addEventListener('message', (event) => {
			const signal: number = JSON.parse(event.data);
			if (signal === 1 || signal === -1)
				setUpGame(game, ws, signal);
		}, { once: true });
		ws.send(JSON.stringify(ids));
	}

	ws.onclose = () => {
		renderGame(game);
		window.cancelAnimationFrame(game.frameId);
	}
}

async function setUpGame(game: Game, ws: WebSocket, ballDir: number) {
	game.ball.dx *= ballDir;
	addMessEvent(game, ws);
	window.addEventListener("keydown", createKeyDownEvent(game.req._keys, game.horizontal));
	window.addEventListener("keyup", createKeyUpEvent(game.req._keys));

	await new Promise(res => setTimeout(res, 500));
	startGame(game, ws);
}
