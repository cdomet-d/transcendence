import { HEIGHT, WIDTH, type Game } from "./game.class.js";
import type { coordinates } from './mess.validation.js';

export function updateBallPos(game: Game, delta: number): boolean {
	let newX: number = game.ball.x + (game.ball.dx * delta);
	let newY: number = game.ball.y + (game.ball.dy * delta);

	if (newX - 10 >= WIDTH || newX + 10 <= 0) {
		game.ball.x = WIDTH / 2;
		game.ball.y = HEIGHT / 2;
		if (game.ball.dx === game.ball.lastdx)
			game.ball.dx *= -1;
		game.ball.lastdx = game.ball.dx;
		return false;
	}

	if ((newY + 10) >= HEIGHT || (newY - 10) <= 0 ) {
		game.ball.dy *= -1;
		newY = game.ball.y + (game.ball.dy * delta);
	}
	if (touchesPad(game.leftPad, game.rightPad, newX, newY)) {
		game.ball.dx *= -1;
		newX = game.ball.x + (game.ball.dx * delta);
	}

	game.ball.x = newX;
	game.ball.y = newY;
	return false
}

function touchesPad(leftPad: coordinates, rightPad: coordinates, newX: number, newY: number): boolean {
	//TODO: fix 460
	if (newX + 10 >= 460 && (newY + 10 >= rightPad.y && newY - 10 <= rightPad.y + 54))
		return true;
	if (newX - 10 <= leftPad.x + 10 && (newY + 10 >= leftPad.y && newY - 10 <= leftPad.y + 54))
		return true;
	//TODO: check top of paddle
	return false;
}
