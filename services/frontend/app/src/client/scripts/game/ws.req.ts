import { startGame } from './game.loop.js';
import { Game } from './game.class.js';
import type { startObj } from './mess.validation.js';
import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./game.events.js";
import { syncClocks } from './syncClocks.js';

export function wsRequest(game: Game) {
	const ws = new WebSocket('wss://localhost:8443/api/game/match'); //?gameID=1');

	ws.onerror = (err) => {
		console.log("error:", err);
		return; //TODO: handle error properly
	}

	ws.onopen = () => {
		console.log("WebSocket connection established!");
		addMessEvent(game, ws);
		ws.addEventListener('message', (event) => {
			const signal: number = JSON.parse(event.data);
			// console.log("SIGNAL:", signal, "TYPE", typeof(signal));
			if (signal === 1 || signal === -1)
				setUpGame(game, ws, signal);
		}, { once: true });
		ws.send(JSON.stringify({gameID: 1, userID: 1})); //TODO: only for testing
	}

	ws.onclose = () => {
		window.cancelAnimationFrame(game.frameId);
	}
}

export async function setUpGame(game: Game, ws: WebSocket, ballDir: number) {
	// addMessEvent(game, ws);

	// const result: [number, number, startObj] | null = await syncClocks(ws)
	// if (!result) return;
	// const [offset, halfTripTime, start] = result;
	// game.clockOffset = offset;
	game.ball.dx *= ballDir;
	window.addEventListener("keydown", createKeyDownEvent(game.req._keys));
	window.addEventListener("keyup", createKeyUpEvent(game.req._keys));

	// wait
	// const waitTime = Math.max(0, start.delay - halfTripTime);
	await new Promise(res => setTimeout(res, 500));

	//start game
	startGame(game, ws);
}
