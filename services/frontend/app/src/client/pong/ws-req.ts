import { startGame } from './game-loop.js';
import { Game, WIDTH, HEIGHT } from './classes/game-class.js';
import { addMessEvent, createKeyEvent } from './game-events.js';
import { renderGame } from './game-render-utils.js';
import { createErrorFeedback } from '../web-elements/event-elements/error.js';

const START_DELAY = 500;

export function wsRequest(game: Game, ids: { gameID: number; userID: number }) {
	const ws = new WebSocket('wss://localhost:8443/api/game/');

	ws.onerror = () => {
		ws.close(1011, "websocket error")
	};

	ws.onopen = () => {
		console.log('PONG webSocket connection established!');
		ws.addEventListener(
			'message',
			(event) => {
				const signal: number = JSON.parse(event.data);
				if (signal === 1 || signal === -1) setUpGame(game, ws, signal);
			},
			{ once: true },
		);
		ws.send(JSON.stringify(ids));
	};

	ws.onclose = (event) => {
		console.log('PONG webSocket connection closed!');
		console.log('EVENT received:  ', event.reason);
		if (event.code === 1003 || event.code === 1011) {
			createErrorFeedback(event.reason); //TODO: fix
			return;
		}
		game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		renderGame(game);
		window.cancelAnimationFrame(game.frameId);
	};
}

async function setUpGame(game: Game, ws: WebSocket, ballDir: number) {
	game.ball.dx *= ballDir;
	addMessEvent(game, ws);
	window.addEventListener('keydown', createKeyEvent(game.req.keys, game.horizontal, true));
	window.addEventListener('keyup', createKeyEvent(game.req.keys, game.horizontal, false));

	await new Promise((res) => setTimeout(res, START_DELAY));
	startGame(game, ws);
}
