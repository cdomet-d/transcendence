import type { coordinates } from './mess.validation.js';
import { Game, type keysObj, HEIGHT, WIDTH, type paddleSpec, type ballObj } from './game.class.js';
import { paddleCollision } from './ball.js';
import { distBallPad } from './ball.utils.js';

const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(paddle: coordinates, leftSide: boolean, game: Game, keys: keysObj) {
	const step: coordinates = {x: 0, y: 0};
	if ((leftSide && keys._w) || (!leftSide && keys._ArrowUp))
		up(paddle, game.padSpec.speed, step);
	if ((leftSide && keys._s) || (!leftSide && keys._ArrowDown))
		down(paddle, game.padSpec, step);
	if (leftSide && keys._a)
		left(paddle, game, 0, step);
	if (leftSide && keys._d)
		right(paddle, game, WIDTH / 2 - game.ball.radius - 1 - game.padSpec.width, step);
	if (!leftSide && keys._ArrowLeft)
		left(paddle, game, WIDTH / 2 + game.ball.radius + 1, step);
	if (!leftSide && keys._ArrowRight)
		right(paddle, game, WIDTH - game.padSpec.width, step);
	const newX: number = game.ball.x - step.x;
	const newY: number = game.ball.y - step.y;
	if (paddleCollision(game, paddle, newX, newY)) {
		game.ball.x += step.x;
		game.ball.y += step.y;
	}
	paddle.x += step.x;
	paddle.y += step.y;
	// movePaddle(game, paddle, step);
}

function up(pad: coordinates, padSpeed: number, step: coordinates) {
	if (pad.y - (padSpeed * TIME_STEP) > 0)
		step.y -= (padSpeed * TIME_STEP);
	else
		step.y -= pad.y;
}

function down(pad: coordinates, padSpec: paddleSpec, step: coordinates) {
	if (pad.y + (padSpec.speed * TIME_STEP) < (HEIGHT - padSpec.height))
		step.y += (padSpec.speed * TIME_STEP);
	else
		step.y += HEIGHT - pad.y - padSpec.height;
}
//TODO: check if ball is between paddle and wall

function left(pad: coordinates, game: Game, limit: number, step: coordinates) {
	if (pad.x  - (game.padSpec.speed * TIME_STEP) > limit)
		step.x -= (game.padSpec.speed * TIME_STEP);
	else
		step.x -= pad.x - limit;
}

function right(pad: coordinates, game: Game, limit: number, step: coordinates) {
	if (pad.x + (game.padSpec.speed * TIME_STEP) < limit)
		step.x += (game.padSpec.speed * TIME_STEP)
	else
		step.x += limit - pad.x;
}

function movePaddle(game: Game, paddle: coordinates, step: coordinates) {
	while (step.x > 0 || step.y > 0) {
		const newX: number = game.ball.x - step.x;
		const newY: number = game.ball.y - step.y;
		const temp: coordinates = { x: game.ball.x, y: game.ball.y }; 
		if (paddleCollision(game, paddle, newX, newY)) {
			const newBall: ballObj = { ...game.ball };
			game.ball.x = temp.x;
			game.ball.y = temp.y;
			const t: number = (newBall.x - game.ball.x) / (newX - game.ball.x);
			paddle.x += step.x * t;
			paddle.y += step.y * t;
			step.x -= step.x * t;
			if (step.x < 0)
				step.x = 0;
			step.y -= step.y * t;
			if (step.y < 0)
				step.y = 0;
			game.ball.x += game.ball.dx * TIME_STEP;
			game.ball.y += game.ball.dy * TIME_STEP;
			// game.ball.x += step.x;
			// game.ball.y += step.y;
		}
		else {
			paddle.x += step.x;
			paddle.y += step.y;
			step.x = 0;
			step.y = 0;
		}
	}
}