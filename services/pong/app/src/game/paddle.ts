import type { coordinates, Player } from '../classes/player.class.js';
import type { keysObj } from './mess.validation.js';
import { Game, HEIGHT, WIDTH, type paddleSpec, type ballObj } from '../classes/game.class.js'
import { updateVelocity, raycast, bounce } from './collision.utils.js';

const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(player: Player, keys: keysObj, game: Game) {
	const step: coordinates = {x: 0, y: 0};
	if ((player.left && keys._w) || (player.right && keys._ArrowUp))
		up(player.paddle, game.padSpec.speed, step);
	if ((player.left && keys._s) || (player.right && keys._ArrowDown))
		down(player.paddle, game.padSpec, step);
	if ((player.left && keys._a))
		left(player.paddle, game, 0, step);
	if ((player.left && keys._d))
		right(player.paddle, game, WIDTH / 2 - game.ball.radius - 1 - game.padSpec.width, step);
	if (player.right && keys._ArrowLeft)
		left(player.paddle, game, WIDTH / 2 + game.ball.radius + 1, step);
	if (player.right && keys._ArrowRight)
		right(player.paddle, game, WIDTH - game.padSpec.width, step);
	movePaddle(game, player.paddle, step);
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
	const nextX: number = game.ball.x - step.x;
	const nextY: number = game.ball.y - step.y;
	const result: [number, coordinates] | null = raycast(game, paddle, nextX, nextY);
	if (!result) {
		paddle.x += step.x;
		paddle.y += step.y;
		return;
	}
	const [t, n] = result;
	let len = Math.hypot(step.x, step.y);
	const contactDist = len * t - game.ball.radius - 1;
	if (contactDist <= 0) {
		bounce(game, paddle, n.x);
		return;
	}
	const nx = step.x / len;
	const ny = step.y / len;
	paddle.x += nx * contactDist;
	paddle.y += ny * contactDist;
	// [game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, nx, ny);
	bounce(game, paddle, n.x);
}