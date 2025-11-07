import type { coordinates } from './mess.validation.js';
import { Game, type keysObj, HEIGHT, WIDTH, type paddleSpec } from './game.class.js';
import { futurePos, leftPadCollision, rightPadCollision } from './ball.js';

const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(game: Game, keys: keysObj) {
	let step: coordinates = {x: 0, y: 0};
    let newX: number = 0;
    let newY: number = 0;
    if (keys._w)
        up(game.leftPad, game.padSpec.speed, step);
    if (keys._s)
        down(game.leftPad, game.padSpec, step);
    if (keys._a)
        left(game.leftPad, game, 0, step);
    if (keys._d)
        right(game.leftPad, game, WIDTH / 2 - game.ball.radius - game.padSpec.width, step);
    newX = game.ball.x - step.x;
	newY = game.ball.y - step.y;
    if (leftPadCollision(game, game.leftPad, newX, newY)) {
        game.ball.x += step.x;
		game.ball.y += step.y;
	}
    game.leftPad.x += step.x;
    game.leftPad.y += step.y;
    if (game.local) {
        step = {x: 0, y: 0};
        if (keys._ArrowUp)
            up(game.rightPad, game.padSpec.speed, step);
        if (keys._ArrowDown)
            down(game.rightPad, game.padSpec, step);
        if (keys._ArrowLeft)
            left(game.rightPad, game, WIDTH / 2 + game.ball.radius, step);
        if (keys._ArrowRight)
            right(game.rightPad, game, WIDTH - game.padSpec.width, step);
        newX = game.ball.x - step.x;
        newY = game.ball.y - step.y;
        if (rightPadCollision(game, game.rightPad, newX, newY)) {
            game.ball.x += step.x;
            game.ball.y += step.y;
        }
        game.rightPad.x += step.x;
        game.rightPad.y += step.y;
    }
}

function up(pad: coordinates, padSpeed: number, step: coordinates) {
	if (pad.y - (padSpeed * TIME_STEP) > 0) {
		step.y -= (padSpeed * TIME_STEP);
	}
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
		step.x += limit - pad.x - game.padSpec.width;
}