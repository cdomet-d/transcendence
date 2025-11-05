import { renderGame } from "./game.render.utils.js";
import { Game, HEIGHT, WIDTH } from "./game.class.js";
import { updatePaddlePos } from "./paddle.js";
import type { repObj } from "./mess.validation.js";
import { deadReckoning } from "./ball.js";

const TIME_STEP: number = 1000 / 60; // 60FPS
const MAX_SCORE: number = 5;

export async function startGame(game: Game, ws: WebSocket) {
	game.lastFrameTime = performance.now();
	game.frameId = requestAnimationFrame(FrameRequestCallback(game, ws));
}

function FrameRequestCallback(game: Game, ws: WebSocket) {
	return async function gameLoop(timestamp: number) {
		const latestReply: repObj | undefined = game.replyHistory[game.replyHistory.length - 1];

		// opponent paddle interpolation
		if (!game.local)
			interpolation(game);

		// client paddle && ball reconciliation
		if (latestReply !== undefined && game.reqHistory.has(latestReply._ID))
			reconciliation(game, latestReply);

		// client paddle prediction
		game.delta += (timestamp - game.lastFrameTime);
		game.lastFrameTime = timestamp;
		while (game.delta >= TIME_STEP) { //TODO: add update limit
			updatePaddlePos(game, game.req._keys, TIME_STEP);
			game.delta -= TIME_STEP;
		}

		// ball dead reckoning
		deadReckoning(game, latestReply);
		
		// score
		if (latestReply !== undefined)
			if (await handleScore(game, latestReply))
				return;

		// request to server
		game.req._timeStamp = performance.now();// + game.clockOffset;
		ws.send(JSON.stringify(game.req));
		game.addReq(game.req);
		game.req._ID += 1; //TODO: overflow

		//draw new frame
		game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		renderGame(game);

		// request new frame
		game.frameId = window.requestAnimationFrame(FrameRequestCallback(game, ws));
	}
}

function interpolation(game: Game) {
	const renderTime: number = performance.now() - 75; //TODO: put 75 in a var
	const updates: [repObj, repObj] | null = game.getReplies(renderTime);

	if (updates) {
		console.log("IN INTERPOLATION");
		const t = (renderTime - updates[0]._timestamp) / 
					(updates[1]._timestamp - updates[0]._timestamp);
		game.rightPad.y = lerp(updates[0]._rightPad.y, updates[1]._rightPad.y, t);
		game.deleteReplies(game.replyHistory.indexOf(updates[0]) - 1);
	}
}

function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * Math.min(Math.max(t, 0), 1);
}

function reconciliation(game: Game, latestReply: repObj) {
	console.log("IN RECONCILIATION")
	const id: number = latestReply._ID;
	game.deleteReq(id);

	game.leftPad.y = latestReply._leftPad.y;
	if (game.local)
		game.rightPad.y = latestReply._rightPad.y;
	game.ball = { ...latestReply._ball };

	for (let i = id + 1; game.reqHistory.has(i); i++) {
		updatePaddlePos(game, game.reqHistory.get(i)!._keys, TIME_STEP);
		deadReckoning(game, latestReply);
	}
}

async function handleScore(game: Game, latestReply: repObj): Promise< boolean > {
	if (latestReply._score[0] != game.score[0] || latestReply._score[1] != game.score[1]) {
		//TODO update score css

		// update score
		game.score[0] = latestReply._score[0];
		game.score[1] = latestReply._score[1];
		game.ball = { ...latestReply._ball };
		game.deleteReplies(game.replyHistory.length);
		if (game.score[0] === MAX_SCORE || game.score[1] === MAX_SCORE)
			return true;
		return false;
	}
 	return false;
}
