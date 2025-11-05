import type { coordinates } from './mess.validation.js';
import { Game, type keysObj, HEIGHT, WIDTH } from './game.class.js';

const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(game: Game, keys: keysObj) {
    console.log("KEYS:", JSON.stringify(keys));
    if (keys._w)
        up(game.leftPad, game.padSpec.speed);
    if (keys._s)
        down(game.leftPad, game.padSpec.speed, game.padSpec.height);
    if (keys._a)
        left(game.leftPad, game, 0);
    if (keys._d)
        right(game.leftPad, game, WIDTH / 2 - game.ball.radius / 2 - game.padSpec.width);
    if (game.local) {
        if (keys._ArrowUp)
            up(game.rightPad, game.padSpec.speed);
        if (keys._ArrowDown)
            down(game.rightPad, game.padSpec.speed, game.padSpec.height);
        if (keys._ArrowLeft)
            left(game.rightPad, game, WIDTH / 2 + game.ball.radius / 2);
        if (keys._ArrowRight)
            right(game.rightPad, game, WIDTH);
    }
}

function up(pad: coordinates, padSpeed: number) {
    if (pad.y - (padSpeed * TIME_STEP) > 0)
        pad.y -= (padSpeed * TIME_STEP);
    else
        pad.y = 0;
}

function down(pad: coordinates, padSpeed: number, paddleHeight: number) {
    if (pad.y + (padSpeed * TIME_STEP) < (HEIGHT - paddleHeight))
        pad.y += (padSpeed * TIME_STEP);
    else
        pad.y = HEIGHT - paddleHeight;
}

function left(pad: coordinates, game: Game, limit: number) {
    if (pad.x  - (game.padSpec.speed * TIME_STEP) > limit)
        pad.x -= (game.padSpec.speed * TIME_STEP);
    else
        pad.x = limit;
}

function right(pad: coordinates, game: Game, limit: number) {
    console.log("IN RIGHT");
    if (pad.x + (game.padSpec.speed * TIME_STEP) < limit)
        pad.x += (game.padSpec.speed * TIME_STEP)
    else
        pad.x = limit;
}