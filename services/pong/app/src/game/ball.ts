import { Game, HEIGHT, WIDTH } from "../classes/game.class.js";
import type { coordinates, Player } from "../classes/player.class.js";
import { raycast, updateVelocity, bounce } from "./collision.utils.js";

const TIME_STEP: number = 1000 / 60; // 60FPS
const MAX_SCORE: number = 5;

export function updateBallPos(game: Game, player1: Player, player2: Player): boolean {
	let nextX: number = game.ball.x + (game.ball.dx * TIME_STEP);
	let nextY: number = game.ball.y + (game.ball.dy * TIME_STEP);

	if (sideWallCollision(game, player1, player2, nextX)) {
		if (player1.score === MAX_SCORE || player2.score === MAX_SCORE)
			return true;
		return false;
	}
	nextY = upperAndBottomWallCollision(game, nextY);
	if (paddleCollision(game, player1.paddle, nextX, nextY))
		return false;
	if (paddleCollision(game, player2.paddle, nextX, nextY))
		return false;

	game.ball.x = nextX;
	game.ball.y = nextY;
	return false;
}

function upperAndBottomWallCollision(game: Game, nextY: number): number {
	if (nextY - game.ball.r <= 0) {
		nextY = game.ball.r + 1;
		game.ball.dy = updateVelocity(game.ball.dx, game.ball.dy, 0, 1)[1];
	}
	if (nextY + game.ball.r >= HEIGHT) {
		nextY = HEIGHT - (game.ball.r + 1);
		game.ball.dy = updateVelocity(game.ball.dx, game.ball.dy, 0, -1)[1];
	}
	return nextY;
}

function sideWallCollision(game: Game, player1: Player, player2: Player, nextX: number): boolean {
	if (nextX - game.ball.r >= WIDTH + 100 || nextX + game.ball.r <= -100) {
		updateScore(game, player1, player2, nextX)
		game.ball.x = WIDTH / 2;
		game.ball.y = HEIGHT / 2;
		game.ball.dx = 0;
		game.ball.dy = 0;
		game.addTimoutID(setTimeout(() => {
			game.ball.dx = 0.3 * game.ballDir;
			game.ball.dy = 0.03;
			game.ballDir *= -1;
		}, 1000));
		return true;
	}
	return false;
}

function updateScore(game: Game, player1: Player, player2: Player, nextX: number) {
	if (nextX - game.ball.r >= WIDTH) {
		player1.incScore();
		// console.log("PLAYER:", player1.score, "ID:", player1.userID);
	}
	if (nextX + game.ball.r <= 0) {
		player2.incScore();
		// console.log("OPPONENT:", player2.score, "ID:", player2.userID);
	}
}

export function paddleCollision(game: Game, paddle: coordinates, nextX: number, nextY: number): boolean {
	const result: [number, coordinates] | null = raycast(game, paddle, nextX, nextY);
	if (!result)
		return false
	const [t, n] = result;
	game.ball.x += game.ball.dx * TIME_STEP * t + 1 * n.x;
	game.ball.y += game.ball.dy * TIME_STEP * t + 1 * n.y;
	// [game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, n.x, n.y);
	bounce(game, paddle, n.x);
	const remainingStep: number = 1 - t;
	game.ball.x += game.ball.dx * TIME_STEP * remainingStep;
	game.ball.y += game.ball.dy * TIME_STEP * remainingStep;
	return true;
}