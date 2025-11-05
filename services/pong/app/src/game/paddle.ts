import type { coordinates, Player } from '../classes/player.class.js';
import type { keysObj } from './mess.validation.js';
import { HEIGHT, type paddleSpec } from '../classes/game.class.js'

const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(player: Player, keys: keysObj, padSpec: paddleSpec) {
    if ((player.left && keys._w) || (player.right && keys._ArrowUp)) {
        up(player.paddle, padSpec.speed);
    }
    if ((player.left && keys._s) || (player.right && keys._ArrowDown)) {
        down(player.paddle, padSpec.speed, padSpec.height);
    }
}

function up(pad: coordinates, padSpeed: number) {
    if (pad.y - (padSpeed * TIME_STEP) > 0)
        pad.y -= (padSpeed * TIME_STEP);
}

function down(pad: coordinates, padSpeed: number, paddleHeight: number) {
    if (pad.y + (padSpeed * TIME_STEP) < (HEIGHT - paddleHeight))
        pad.y += (padSpeed * TIME_STEP);
}

//TODO: check if ball is between paddle and wall