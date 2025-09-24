import type { paddlePos, Player } from '../classes/player.class.js';
import type { keysObj } from './pong.js';

const WIDTH = 480;
const HEIGHT = 270;
const padSpeed: number = 5;

export function updatePaddlePos(player: Player, keys: keysObj) {
    if (keys.w || keys.ArrowUp)
        up(player.paddle);
    if (keys.s || keys.ArrowDown)
        down(player.paddle);
}

function up(pad: paddlePos) {
    if (pad.y - padSpeed > 0)
        pad.y -= padSpeed;
}

function down(pad: paddlePos) {
    if (pad.y + padSpeed < (HEIGHT - 54))
        pad.y += padSpeed;
}
