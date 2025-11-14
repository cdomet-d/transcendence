import { Game, HEIGHT, WIDTH } from "../classes/game.class.js";
import type { coordinates, Player } from "../classes/player.class.js";
import { raycast, updateVelocity, bounce } from "./collision.utils.js";

const TIME_STEP: number = 1000 / 60; // 60FPS
const MAX_SCORE: number = 5;

export function updateBallPos(game: Game, player1: Player, player2: Player): boolean {
	let newX: number = game.ball.x + (game.ball.dx * TIME_STEP);
	let newY: number = game.ball.y + (game.ball.dy * TIME_STEP);

	if (sideWallCollision(game, player1, player2, newX)) {
		if (player1.score === MAX_SCORE || player2.score === MAX_SCORE)
			return true;
		return false;
	}
	newY = upperAndBottomWallCollision(game, newY);
	if (paddleCollision(game, player1.paddle, newX, newY))
		return false;
	if (paddleCollision(game, player2.paddle, newX, newY))
		return false;

	game.ball.x = newX;
	game.ball.y = newY;
	return false;
}

function upperAndBottomWallCollision(game: Game, newY: number): number {
	if (newY - game.ball.radius <= 0) {
		newY = game.ball.radius + 1;
		game.ball.dy = updateVelocity(game.ball.dx, game.ball.dy, 0, 1)[1];
	}
	if (newY + game.ball.radius >= HEIGHT) {
		newY = HEIGHT - (game.ball.radius + 1);
		game.ball.dy = updateVelocity(game.ball.dx, game.ball.dy, 0, -1)[1];
	}
	return newY;
}

function sideWallCollision(game: Game, player1: Player, player2: Player, newX: number): boolean {
	if (newX - game.ball.radius >= WIDTH + 100 || newX + game.ball.radius <= -100) {
		updateScore(game, player1, player2, newX)
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

function updateScore(game: Game, player1: Player, player2: Player, newX: number) {
	if (newX - game.ball.radius >= WIDTH) {
		player1.incScore();
		console.log("PLAYER:", player1.score, "ID:", player1.userID);
	}
	if (newX + game.ball.radius <= 0) {
		player2.incScore();
		console.log("OPPONENT:", player2.score, "ID:", player2.userID);
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