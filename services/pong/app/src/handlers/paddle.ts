import type { WebSocket } from '@fastify/websocket';
import type { paddlePos } from '../classes/player.class.js';
import type { Player } from '../classes/player.class.js';

const WIDTH = 480;
const HEIGHT = 270;
const padSpeed: number = 7;

export function paddlePos(player: Player, key: string) {
    if (key === "w" || key === "ArrowUp") {
        up(player.paddle, player.socket);
    }
    if (key === "s" || key === "ArrowDown") {
        down(player.paddle, player.socket);
    }
}

function up(pad: paddlePos, socket: WebSocket) {
    if (pad.y - padSpeed > 0)
        pad.y -= padSpeed;
    if (socket.readyState === 1)
        socket.send(pad.y.toString());
    //else
}

function down(pad: paddlePos, socket: WebSocket) {
    if (pad.y + padSpeed < (HEIGHT - 54))
        pad.y += padSpeed;
    if (socket.readyState === 1)
        socket.send(pad.y.toString());
    //else
}
