import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./game.events.js";
import { renderGame } from "./game.render.utils.js";
import { Game, HEIGHT, WIDTH, type serverReplyObj } from "./game.class.js";
import { updatePaddlePos } from "./paddle.js";
import { updateBallPos } from "./ball.js";

const TIME_STEP: number = 1000 / 60; // 60FPS

export function startGame(game: Game, ws: WebSocket) {
	addMessEvent(game, ws);
	window.addEventListener("keydown", createKeyDownEvent(game.req._keys));
	window.addEventListener("keyup", createKeyUpEvent(game.req._keys));
	const lastServerState: serverReplyObj = { ...game.servReply };
	ws.send("1");
	game.frameId = requestAnimationFrame((timestamp) => {
		game.lastFrameTime = timestamp;
		game.frameId = requestAnimationFrame(FrameRequestCallback(game, lastServerState, ws));
	});
}

function FrameRequestCallback(game: Game, lastServerState: serverReplyObj, ws: WebSocket) {
	return function gameLoop(timestamp: number) {
		if (game.reqHistory.has(game.servReply._ID))
			reconciliation(game);
		ws.send(JSON.stringify(game.req));
		game.addReq(game.req);
		game.req._ID += 1; //TODO: overflow
		// game.req._timeStamp = timestamp;
		game.delta += (timestamp - game.lastFrameTime);
		game.lastFrameTime = timestamp;
		while (game.delta >= TIME_STEP) { //prediction
			updatePaddlePos(game, game.req._keys, TIME_STEP);
			updateBallPos(game, TIME_STEP);
			game.delta -= TIME_STEP;
		}
		lastServerState = { ...game.servReply };
		game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		renderGame(game);
		game.frameId = window.requestAnimationFrame(FrameRequestCallback(game, lastServerState, ws));
	}
}

function reconciliation(game: Game) {
	const id: number = game.servReply._ID;
	game.deleteReq(id);

	game.leftPad.y = game.servReply._leftPaddle.y;
	game.rightPad.y = game.servReply._rightPaddle.y;
	game.ball.x = game.servReply._ball.x;
	game.ball.y = game.servReply._ball.y;

	let timestamp: number;
	let lastTimeStamp: number = Date.now();
	let delta: number = 0;
	for (let i = id + 1; game.reqHistory.has(i); i++) {
		// timestamp = Date.now();
		// delta += (timestamp - lastTimeStamp);
		// lastTimeStamp = timestamp;
		// while (delta >= TIME_STEP) {
			updatePaddlePos(game, game.reqHistory.get(i)!._keys, TIME_STEP)
			updateBallPos(game, TIME_STEP);
		// 	delta -= TIME_STEP;
		// }
	}
}
