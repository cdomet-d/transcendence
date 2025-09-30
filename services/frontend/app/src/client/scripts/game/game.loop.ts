import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./game.events.js";
import { renderGame } from "./game.render.utils.js";
import { Game } from "./game.class.js";

export function startGame(game: Game, ws: WebSocket) {
	window.addEventListener("keydown", createKeyDownEvent(game.mess._keys));
	window.addEventListener("keyup", createKeyUpEvent(game.mess._keys));
	addMessEvent(game, ws);
	window.requestAnimationFrame(FrameRequestCallback(game, ws));
}

function FrameRequestCallback(game: Game, ws: WebSocket) {
	return function gameLoop(timestamp: number) {
		game.mess._timeStamp = timestamp;
		ws.send(JSON.stringify(game.mess));
		game.ctx.clearRect(0, 0, game.width, game.height);
		// game.ctx.drawImage(game.image, 0, 0);
		renderGame(game);
		window.requestAnimationFrame(FrameRequestCallback(game, ws));
	}
}
