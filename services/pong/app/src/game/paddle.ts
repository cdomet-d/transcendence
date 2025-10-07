import type { coordinates, Player } from '../classes/player.class.js';
import type { keysObj } from './mess.validation.js';
import { HEIGHT } from '../classes/game.class.js'

export function updatePaddlePos(player: Player, keys: keysObj, delta: number) {
    if ((player.left && keys._w) || (player.right && keys._ArrowUp))
        up(player.paddle, player.speed.paddle, delta);
    if ((player.left && keys._s) || (player.right && keys._ArrowDown))
        down(player.paddle, player.speed.paddle, delta);
}

function up(pad: coordinates, padSpeed: number, delta: number) {
    if (pad.y - (padSpeed * delta) > 0)
        pad.y -= (padSpeed * delta);
}

function down(pad: coordinates, padSpeed: number, delta: number) {
    if (pad.y + (padSpeed * delta) < (HEIGHT - 54))
        pad.y += (padSpeed * delta);
}
