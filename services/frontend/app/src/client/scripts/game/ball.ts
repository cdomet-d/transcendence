import { Game, HEIGHT, type ballObj } from "./game.class.js";
import type { coordinates, repObj } from "./mess.validation.js";

const TIME_STEP: number = 1000 / 60; // 60FPS
const BALL_RADIUS: number = 10;

export function deadReckoning(game: Game, latestReply: repObj | undefined) {
	console.log("IN DEADRECKONING");
	let timeSinceUpdate: number = performance.now() - game.lastFrameTime; //TIME_STEP;
	let ball: ballObj = { ...game.ball };
	if (latestReply !== undefined) {
		timeSinceUpdate = (performance.now() - latestReply._timestamp)
		ball = latestReply._ball;
	}
	if (timeSinceUpdate > 100) //TODO: add var for 100
		timeSinceUpdate = 100
	let newX: number = ball.x + ball.dx * timeSinceUpdate;
	let newY: number = ball.y + ball.dy * timeSinceUpdate;
	updateBallPos(game, newX, newY);
}

function updateBallPos(game: Game, newX: number, newY: number): boolean {
	if ((newY + BALL_RADIUS) >= HEIGHT || (newY - BALL_RADIUS) <= 0 ) {
		[game.ball.dy, game.ball.dx] = increaseVelocity(game.ball.dy, game.ball.dx);
		newX = game.ball.x + (game.ball.dx * TIME_STEP);
		newY = game.ball.y + (game.ball.dy * TIME_STEP);
	}
	if (paddleCollision(game.leftPad, game.leftPad, newX, newY)) {
		[game.ball.dx, game.ball.dy] = increaseVelocity(game.ball.dx, game.ball.dy);
		newY = game.ball.y + (game.ball.dy * TIME_STEP);
		newX = game.ball.x + (game.ball.dx * TIME_STEP);
	}

	game.ball.x = newX;
	game.ball.y = newY;
	return false;
}

function increaseVelocity(v1: number, v2: number): [number, number] {
	if (v1 > 0.5 || v1 < -0.5)
		v1 *= -1;
	else
		v1 *= -1.1;
	if (v2 <= 0.5 && v2 >= -0.5)
		v2 *= 1.1;
	return [v1, v2];
}

function paddleCollision(leftPad: coordinates, rightPad: coordinates, newX: number, newY: number): boolean {
	if (newX + BALL_RADIUS >= rightPad.x 
		&& newX - BALL_RADIUS <= rightPad.x + BALL_RADIUS 
		&& newY + BALL_RADIUS >= rightPad.y 
		&& newY - BALL_RADIUS <= rightPad.y + 54)
		return true;
	if (newX - BALL_RADIUS <= leftPad.x + BALL_RADIUS 
		&& newX + BALL_RADIUS >= leftPad.x 
		&& newY + BALL_RADIUS >= leftPad.y 
		&& newY - BALL_RADIUS <= leftPad.y + 54)
		return true;
	//TODO: check top of paddle
	return false;
}
