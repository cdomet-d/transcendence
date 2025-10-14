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
		ws.send(JSON.stringify(game.req));
		game.addReq(game.req);
		reconciliation(game, lastServerState);
		game.req._ID += 1; //TODO: overflow
		game.req._timeStamp = timestamp;
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
   
function reconciliation(game: Game, lastServerState: serverReplyObj) {
	const id: number = game.servReply._ID;
	game.deleteReq(id);

	let fixLefty: number = 0;
	let fixRighty: number = 0;
	let fixBallx: number = 0;
	let fixBally: number = 0;

	if (lastServerState._leftPaddle.y != game.servReply._leftPaddle.y)
		fixLefty = game.servReply._leftPaddle.y - game.reqHistory[id]!._leftPaddle.y;
	if (lastServerState._rightPaddle.y != game.servReply._rightPaddle.y)
		fixRighty = game.servReply._rightPaddle.y - game.reqHistory[id]!._rightPaddle.y;
	if (lastServerState._ball.x != game.servReply._ball.x)
		fixBallx = game.servReply._ball.x - game.reqHistory[id]!._ball.x;
	if (lastServerState._ball.y != game.servReply._ball.y)
		fixBally = game.servReply._ball.y - game.reqHistory[id]!._ball.y;

	for (let i = 0; i < game.reqHistory.length; i++) {
		game.reqHistory[i]!._leftPaddle.y += fixLefty; //TODO: fix !
		if (game.local)
			game.reqHistory[i]!._rightPaddle.y += fixRighty;
		else
			game.reqHistory[i]!._rightPaddle.y = game.servReply._rightPaddle.y;
		game.reqHistory[i]!._ball.x += fixBallx;
		game.reqHistory[i]!._ball.y += fixBally;
	}

	game.leftPad.y += fixLefty;
	if (game.local)
		game.rightPad.y += fixRighty;
	else
		game.rightPad.y = game.servReply._rightPaddle.y;
	game.ball.x += fixBallx;
	game.ball.y += fixBally;

	// game.leftPad.y += (game.servReply._leftPaddle.y - game.leftPad.y) * 0.2;
	// game.rightPad.y += (game.servReply._rightPaddle.y - game.rightPad.y) * 0.2;
	// game.ball.x += (game.servReply._ball.x - game.ball.x) * 0.2;
	// game.ball.y += (game.servReply._ball.y - game.ball.y) * 0.2;
}
