import { Game, HEIGHT, WIDTH } from './classes/game.class.js';
import { raycast, updateVelocity } from './collision.utils.js';
import type { keysObj, paddleSpec, coordinates } from './classes/game.interfaces.js';

const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(paddle: coordinates, leftSide: boolean, game: Game, keys: keysObj) {
    const step: coordinates = { x: 0, y: 0 };
    if ((leftSide && keys._w) || (!leftSide && keys._ArrowUp)) up(paddle, game.padSpec.speed, step);
    if ((leftSide && keys._s) || (!leftSide && keys._ArrowDown)) down(paddle, game.padSpec, step);
    if (leftSide && keys._a) left(paddle, game, 0, step);
    if (leftSide && keys._d)
        right(paddle, game, WIDTH / 2 - game.ball.r - 1 - game.padSpec.w, step);
    if (!leftSide && keys._ArrowLeft) left(paddle, game, WIDTH / 2 + game.ball.r + 1, step);
    if (!leftSide && keys._ArrowRight) right(paddle, game, WIDTH - game.padSpec.w, step);
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

function movePaddle(game: Game, paddle: coordinates, step: coordinates) {
    let nextX: number = game.ball.x - step.x;
    let nextY: number = game.ball.y - step.y;
    let result: [number, coordinates] | null = raycast(game, paddle, nextX, nextY);
    paddle.x += step.x;
    paddle.y += step.y;
    if (!result) {
        return;
    }
    let [t, n] = result;
    // let len = Math.hypot(step.x, step.y);
    // const contactDist = len * t - game.ball.r - 1;
    // if (contactDist <= 0) {
    //     updateVelocity(game, paddle, n.x);
    //     return;
    // }
    // const nx = step.x / len;
    // const ny = step.y / len;
    // paddle.x += nx * contactDist;
    // paddle.y += ny * contactDist;
    updateVelocity(game, paddle, n.x);
    nextX = game.ball.x + (game.ball.dx * TIME_STEP);
	nextY = game.ball.y + (game.ball.dy * TIME_STEP);
    result = raycast(game, paddle, nextX, nextY);
    if (!result)
        return;
    [t, n] = result;
    game.ball.x += game.ball.dx * TIME_STEP * t + 1 * n.x;
	game.ball.y += game.ball.dy * TIME_STEP * t + 1 * n.y;


    // const nextX: number = game.ball.x - step.x;
    // const nextY: number = game.ball.y - step.y;
    // const result: [number, coordinates] | null = raycast(game, paddle, nextX, nextY);
    // if (!result) {
    //     paddle.x += step.x;
    //     paddle.y += step.y;
    //     return;
    // }
    // const [t, n] = result;
    // let len = Math.hypot(step.x, step.y);
    // const contactDist = len * t - game.ball.r - 1;
    // if (contactDist <= 0) {
    //     updateVelocity(game, paddle, n.x);
    //     return;
    // }
    // const nx = step.x / len;
    // const ny = step.y / len;
    // paddle.x += nx * contactDist;
    // paddle.y += ny * contactDist;
    // updateVelocity(game, paddle, n.x);
}
