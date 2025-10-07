import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./game.events.js";
import { renderGame } from "./game.render.utils.js";
import { Game, HEIGHT, WIDTH } from "./game.class.js";

export function startGame(game: Game, ws: WebSocket) {
	window.addEventListener("keydown", createKeyDownEvent(game.mess._keys));
	window.addEventListener("keyup", createKeyUpEvent(game.mess._keys));
	addMessEvent(game, ws);
	game.frameId = window.requestAnimationFrame(FrameRequestCallback(game, ws));
}

function FrameRequestCallback(game: Game, ws: WebSocket) {
	return function gameLoop(timestamp: number) {
		if (game.signal === 0) {
			window.cancelAnimationFrame(game.frameId);
			ws.close();
			return ;
		}
		game.mess._timeStamp = timestamp;
		ws.send(JSON.stringify(game.mess));
		game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		renderGame(game);
		game.frameId = window.requestAnimationFrame(FrameRequestCallback(game, ws));
	}
}
