import type { paddleObj, Player } from '../classes/player.class.js';
import type { keysObj } from './mess.validation.js';

const WIDTH = 480;
const HEIGHT = 270;
const padSpeed: number = 0.2;

export function updatePaddlePos(player: Player, keys: keysObj, delta: number) {
	if ((player.left && keys._w) || (player.right && keys._ArrowUp))
		up(player.paddle, delta);
	if ((player.left && keys._s) || (player.right && keys._ArrowDown))
		down(player.paddle, delta);
}

function up(pad: paddleObj, delta: number) {
	if (pad.y - (padSpeed * delta) > 0)
		pad.y -= (padSpeed * delta);
}

function down(pad: paddleObj, delta: number) {
	if (pad.y + (padSpeed * delta) < (HEIGHT - 54))
		pad.y += (padSpeed * delta);
}
