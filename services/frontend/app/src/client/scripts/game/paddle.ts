import type { coordinates } from './mess.validation.js';
import { type keysObj, HEIGHT, type Game } from './game.class.js';

export function updatePaddlePos(game: Game, keys: keysObj, delta: number) {
    if (keys._w)
        up(game.leftPad, game.paddleSpeed, delta);
    if (keys._s)
        down(game.leftPad, game.paddleSpeed, delta);
    if (keys._ArrowUp && game.local)
        up(game.rightPad, game.paddleSpeed, delta);
    if (keys._ArrowDown && game.local)
        down(game.rightPad, game.paddleSpeed, delta);
}

function up(pad: coordinates, padSpeed: number, delta: number) {
    if (pad.y - (padSpeed * delta) > 0)
        pad.y -= (padSpeed * delta);
}

function down(pad: coordinates, padSpeed: number, delta: number) {
    if (pad.y + (padSpeed * delta) < (HEIGHT - 54))
        pad.y += (padSpeed * delta);
}
