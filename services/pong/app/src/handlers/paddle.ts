import type { paddlePos, Player } from '../classes/player.class.js';
import type { keysObj } from './pong.js';

const WIDTH = 480;
const HEIGHT = 270;
const padSpeed: number = 0.2;

export function updatePaddlePos(player: Player, keys: keysObj, delta: number) {
    if (keys._w || keys._ArrowUp)
        up(player.paddle, delta);
    if (keys._s || keys._ArrowDown)
        down(player.paddle, delta);
}

function up(pad: paddlePos, delta: number) {
    if (pad.y - (padSpeed * delta) > 0)
        pad.y -= (padSpeed * delta);
}

function down(pad: paddlePos, delta: number) {
    if (pad.y + (padSpeed * delta) < (HEIGHT - 54))
        pad.y += (padSpeed * delta);
}
