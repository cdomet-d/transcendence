import type { coordinates } from './mess.validation.js';
import { Game, type keysObj, HEIGHT, WIDTH, type paddleSpec } from './game.class.js';
import { updateVelocity, raycast } from './collision.utils.js';

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
	movePaddle(game, paddle, step);
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
	let len = Math.hypot(step.x, step.y);
	while (len > 0.0001) {
		const nextX: number = game.ball.x - step.x;
		const nextY: number = game.ball.y - step.y;
		const result: [number, coordinates] | null = raycast(game, paddle, nextX, nextY);
		if (!result) {
			paddle.x += step.x;
			paddle.y += step.y;
			break;
		}
		const t: number = result[0];
		const n: coordinates = result[1];
		const x: number = (step.x * t) - n.x * (game.ball.radius + 1);
		const y: number = (step.y * t) - n.y * (game.ball.radius + 1);
		paddle.x += x;
		paddle.y += y;
		step.x -= x;
		step.y -= y;
		[game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, n.x, n.y);
		game.ball.x += game.ball.dx * TIME_STEP; //TODO: utiliser le temps qu'il reste de la frame pas TIME_STEP
		game.ball.y += game.ball.dy * TIME_STEP;
		len = Math.hypot(step.x, step.y);
	}
}
