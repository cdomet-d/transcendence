import type { coordinates, Player } from '../classes/player.class.js';
import type { keysObj } from './mess.validation.js';
import { HEIGHT } from '../classes/game.class.js'

const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(player: Player, keys: keysObj, padSpeed: number) {
    if ((player.left && keys._w) || (player.right && keys._ArrowUp)) {
        up(player.paddle, padSpeed);
    }
    if ((player.left && keys._s) || (player.right && keys._ArrowDown)) {
        down(player.paddle, padSpeed);
    }
}

function up(pad: coordinates, padSpeed: number) {
    if (pad.y - (padSpeed * TIME_STEP) > 0)
        pad.y -= (padSpeed * TIME_STEP);
}

function down(pad: coordinates, padSpeed: number) {
    if (pad.y + (padSpeed * TIME_STEP) < (HEIGHT - 54))
        pad.y += (padSpeed * TIME_STEP);
}
