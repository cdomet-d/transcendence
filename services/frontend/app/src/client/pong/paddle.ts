import { Game, HEIGHT, WIDTH } from './classes/game-class.js';
import { raycast, updateVelocity } from './collision-utils.js';
import type { keysObj, paddleSpec, coordinates } from './classes/game-interfaces.js';

const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(paddle: coordinates, leftSide: boolean, game: Game, keys: keysObj) {
    let step: coordinates = { x: 0, y: 0 };
    if (leftSide) step = game.leftStep;
    else step = game.rightStep;
    if ((leftSide && keys.w) || (!leftSide && keys.ArrowUp)) up(paddle, game.padSpec.speed, step);
    if ((leftSide && keys.s) || (!leftSide && keys.ArrowDown)) down(paddle, game.padSpec, step);
    if (leftSide && keys.a) left(paddle, game, 0, step);
    if (leftSide && keys.d) right(paddle, game, WIDTH / 2 - game.ball.r - 10 - game.padSpec.w, step);
    if (!leftSide && keys.ArrowLeft) left(paddle, game, WIDTH / 2 + game.ball.r + 10, step);
    if (!leftSide && keys.ArrowRight) right(paddle, game, WIDTH - game.padSpec.w, step);
    movePaddle(game, paddle, step);
}

function up(pad: coordinates, padSpeed: number, step: coordinates) {
    if (pad.y - padSpeed * TIME_STEP > 0) step.y -= padSpeed * TIME_STEP;
    else step.y -= pad.y;
}

function down(pad: coordinates, padSpec: paddleSpec, step: coordinates) {
    if (pad.y + padSpec.speed * TIME_STEP < HEIGHT - padSpec.h) step.y += padSpec.speed * TIME_STEP;
    else step.y += HEIGHT - pad.y - padSpec.h;
}

function left(pad: coordinates, game: Game, limit: number, step: coordinates) {
    if (pad.x - game.padSpec.speed * TIME_STEP > limit) step.x -= game.padSpec.speed * TIME_STEP;
    else step.x -= pad.x - limit;
}

function right(pad: coordinates, game: Game, limit: number, step: coordinates) {
    if (pad.x + game.padSpec.speed * TIME_STEP < limit) step.x += game.padSpec.speed * TIME_STEP;
    else step.x += limit - pad.x;
}

export function movePaddle(game: Game, paddle: coordinates, step: coordinates) {
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
