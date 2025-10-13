import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./game.events.js";
import { renderGame } from "./game.render.utils.js";
import { Game, HEIGHT, WIDTH, type serverReplyObj } from "./game.class.js";
import { updatePaddlePos } from "./paddle.js";
import { updateBallPos } from "./ball.js";

const TIME_STEP: number = 1000 / 60; // 60FPS

export function startGame(game: Game, ws: WebSocket) {
	addMessEvent(game, ws);
	window.addEventListener("keydown", createKeyDownEvent(game.mess._keys));
	window.addEventListener("keyup", createKeyUpEvent(game.mess._keys));
	const lastServerState: serverReplyObj = { ...game.servReply };
	game.frameId = requestAnimationFrame((timestamp) => {
		game.lastFrameTime = timestamp;
		game.frameId = requestAnimationFrame(FrameRequestCallback(game, lastServerState, ws));
	});
}

function FrameRequestCallback(game: Game, lastServerState: serverReplyObj, ws: WebSocket) {
	return function gameLoop(timestamp: number) {
		ws.send(JSON.stringify(game.mess));
		reconciliation(game, lastServerState);
		game.mess._ID += 1; //TODO: overflow
		game.mess._timeStamp = timestamp;
		game.delta += (timestamp - game.lastFrameTime);
		game.lastFrameTime = timestamp;
		while (game.delta >= TIME_STEP) { //prediction
			updatePaddlePos(game, game.mess._keys, TIME_STEP);
			updateBallPos(game, TIME_STEP);
			game.delta -= TIME_STEP;
		}
		lastServerState = { ...game.servReply };
		game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		renderGame(game);
		game.frameId = window.requestAnimationFrame(FrameRequestCallback(game, lastServerState, ws));
	}
}

function reconciliation(game: Game, lastServerState: serverReplyObj) {
	if (lastServerState.leftPaddle.y != game.servReply.leftPaddle.y) {
		// game.leftPad.y += (game.servReply.leftPaddle.y - game.leftPad.y) * 0.2;
		for (let i = game.servReply.ID; i < game.messHistory.length; i++) {
			
		}
	}

	if (game.local) {
		if (lastServerState.rightPaddle.y != game.servReply.rightPaddle.y)
			game.rightPad.y += (game.servReply.rightPaddle.y - game.rightPad.y) * 0.2;
	}
	else
		game.rightPad.y = game.servReply.rightPaddle.y;
	if (lastServerState.ball.x != game.servReply.ball.x)
		game.ball.x += (game.servReply.ball.x - game.ball.x) * 0.2;
	if (lastServerState.ball.y != game.servReply.ball.y)
		game.ball.y += (game.servReply.ball.y - game.ball.y) * 0.2;

}
