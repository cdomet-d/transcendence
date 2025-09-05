import type { WebSocket } from '@fastify/websocket';

const WIDTH = 480;
const HEIGHT = 270;
const padSpeed: number = 7;

interface paddelPos {
	x: number;
	y: number;
}

let leftPad: paddelPos = {x: 10, y: 108};
let rightPad: paddelPos = {x: 460, y: 108};

function paddlePos(socket: WebSocket, message: string) {
    const key: string = message.slice(5, message.length);
    if (key === "ArrowUp") {
        up(rightPad, socket);
    }
    if (key === "ArrowDown") {
        down(rightPad, socket);
    }
    if (key === "w") {
        up(leftPad, socket);
    }
    if (key === "s") {
        down(leftPad, socket);
    }
}

function up(pad: paddelPos, socket: WebSocket) {
    if (pad.y - padSpeed > 0)
        pad.y -= padSpeed;
    socket.send(pad.y.toString());
}

function down(pad: paddelPos, socket: WebSocket) {
    if (pad.y + padSpeed < (HEIGHT - 54))
        pad.y += padSpeed;
    socket.send(pad.y.toString());
}

export { paddlePos };