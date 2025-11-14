import { Game, HEIGHT, WIDTH, type ballObj } from "./game.class.js";
import type { coordinates, repObj } from "./mess.validation.js";
import { updateVelocity, raycast } from "./collision.utils.js";

export function deadReckoning(game: Game, latestReply: repObj | undefined) {
	// console.log("IN DEADRECKONING");
	let timeSinceUpdate: number = performance.now() - game.lastFrameTime;
	let ball: ballObj = { ...game.ball };
	if (latestReply !== undefined) {
		timeSinceUpdate = (performance.now() - latestReply._timestamp)
		ball = { ...latestReply._ball };
	}
	if (timeSinceUpdate > 100) //TODO: add var for 100
		timeSinceUpdate = 100;
	const nextX: number = ball.x + ball.dx * timeSinceUpdate;
	const nextY: number = ball.y + ball.dy * timeSinceUpdate;
	// updateBallPos(game, nextX, nextY);
}

const TIME_STEP: number = 1000 / 60; // 60FPS
export function updateBallPos(game: Game) {//}, nextX: number, nextY: number) {
	let nextX: number = game.ball.x + (game.ball.dx * TIME_STEP);
	let nextY: number = game.ball.y + (game.ball.dy * TIME_STEP);
	if (sideWallCollision(game, nextX))
		return false;
	nextY = upperAndBottomWallCollision(game, nextY);
	if (paddleCollision(game, game.leftPad, nextX, nextY))
		return false;
	if (paddleCollision(game, game.rightPad, nextX, nextY))
		return false;

	game.ball.x = nextX;
	game.ball.y = nextY;
}

let ballDir = -1;
function sideWallCollision(game: Game, nextX: number): boolean {
	if (nextX - game.ball.radius >= WIDTH + 100 || nextX + game.ball.radius <= -100) {
		game.ball.x = WIDTH / 2;
		game.ball.y = HEIGHT / 2;
		game.ball.dx = 0;
		game.ball.dy = 0;
		setTimeout(() => {
			game.ball.dx = 0.3 * ballDir;
			game.ball.dy = 0.03;
			ballDir *= -1;
		}, 1000);
		return true;
	}
	return false;
}

function upperAndBottomWallCollision(game: Game, nextY: number): number {
	if (nextY - game.ball.radius <= 0) {
		nextY = game.ball.radius + 1;
		game.ball.dy = updateVelocity(game.ball.dx, game.ball.dy, 0, 1)[1];
	}
	if (nextY + game.ball.radius >= HEIGHT) {
		nextY = HEIGHT - (game.ball.radius + 1);
		game.ball.dy = updateVelocity(game.ball.dx, game.ball.dy, 0, -1)[1];
	}
	return nextY;
}

export function paddleCollision(game: Game, paddle: coordinates, nextX: number, nextY: number): boolean {
	const result: [number, coordinates] | null = raycast(game, paddle, nextX, nextY);
	if (!result)
		return false
	const [t, n] = result;
	game.ball.x += game.ball.dx * TIME_STEP * t + 1 * n.x;
	game.ball.y += game.ball.dy * TIME_STEP * t + 1 * n.y;
	[game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, n.x, n.y);
	const remainingStep: number = 1 - t;
	game.ball.x += game.ball.dx * TIME_STEP * remainingStep;
	game.ball.y += game.ball.dy * TIME_STEP * remainingStep;
	return true;
}
