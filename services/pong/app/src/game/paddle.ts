import type { Player } from '../classes/player.class.js';
import { Game, HEIGHT, WIDTH } from '../classes/game.class.js'
import { raycast, updateVelocity } from './collision.utils.js';
import type { coordinates, keysObj, paddleSpec } from '../classes/game.interfaces.js';

const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(player: Player, keys: keysObj, game: Game) {
	if ((player.left && keys._w)
		|| (player.right && (keys._ArrowUp|| !game.local && keys._w)))
		up(player.paddle, game.padSpec.speed, player.padStep);
	if ((player.left && keys._s)
		|| (player.right && (keys._ArrowDown || !game.local && keys._s)))
		down(player.paddle, game.padSpec, player.padStep);
	if ((player.left && keys._a))
		left(player.paddle, game, 0, player.padStep);
	if ((player.left && keys._d))
		right(player.paddle, game, WIDTH / 2 - game.ball.r - 1 - game.padSpec.w, player.padStep);
	if (player.right && (keys._ArrowLeft || !game.local && keys._d))
		left(player.paddle, game, WIDTH / 2 + game.ball.r + 1, player.padStep);
	if (player.right && (keys._ArrowRight || !game.local && keys._a))
		right(player.paddle, game, WIDTH - game.padSpec.w, player.padStep);
	movePaddle(game, player.paddle, player.padStep); //TODO: clean by only giving obj player
}

function up(pad: coordinates, padSpeed: number, step: coordinates) {
	if (pad.y - (padSpeed * TIME_STEP) > 0)
		step.y -= (padSpeed * TIME_STEP);
	else
		step.y -= pad.y;
}

function down(pad: coordinates, padSpec: paddleSpec, step: coordinates) {
	if (pad.y + (padSpec.speed * TIME_STEP) < (HEIGHT - padSpec.h))
		step.y += (padSpec.speed * TIME_STEP);
	else
		step.y += HEIGHT - pad.y - padSpec.h;
}

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
	// let nextX: number = game.ball.x - step.x;
    // let nextY: number = game.ball.y - step.y;
    // let result: [number, coordinates] | null = raycast(game, paddle, nextX, nextY);
	// paddle.x += step.x;
    // paddle.y += step.y;
	// if (!result)
    //     return;
	// let [t, n] = result;
	// // if (game.ball.y - game.ball.r <= 0 && n.y === -1) {
	// // 	paddle.y = game.ball.x + game.ball.r + 1;
	// // 	return;
	// // }
	// updateVelocity(game, paddle, n.x);
    // nextX = game.ball.x + (game.ball.dx * TIME_STEP);
	// nextY = game.ball.y + (game.ball.dy * TIME_STEP);
	// // if (nextY - game.ball.r <= 0) {
	// // 	game.ball.y = game.ball.r + 1;
	// // 	game.ball.dy *= -1;
	// // 	paddle.y = game.ball.x + game.ball.r + 1;
	// // 	return;
	// // } //TODO: do the same for bottom wall and test this by decreasing ball speed and placing it on top
    // result = raycast(game, paddle, nextX, nextY);
    // if (!result)
    //     return;
    // [t, n] = result;
    // game.ball.x += game.ball.dx * TIME_STEP * t + 1 * n.x;
	// game.ball.y += game.ball.dy * TIME_STEP * t + 1 * n.y;



	const nextX: number = game.ball.x - step.x;
	const nextY: number = game.ball.y - step.y;
	const result: [number, coordinates] | null = raycast(game, paddle, nextX, nextY);
	if (!result) {
		paddle.x += step.x;
		paddle.y += step.y;
		step.x = 0;
        step.y = 0;
		return;
	}
	const [t, n] = result;
	let len = Math.hypot(step.x, step.y);
	const contactDist = len * t - game.ball.r - 1;
	if (contactDist <= 0) {
		updateVelocity(game, paddle, n.x);
		return;
	}
	const nx = step.x / len;
    const ny = step.y / len;
    const x: number = nx * contactDist;
    const y: number = ny * contactDist;
    paddle.x += x;
    paddle.y += y;
    step.x -= x;
    step.y -= y;
	updateVelocity(game, paddle, n.x);
}
