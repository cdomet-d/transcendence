import type { WebSocket } from '@fastify/websocket';

function handleQuickMatch(socket: WebSocket, message: string) {
    let queue: WebSocket[] = [];
    if (message === "quickMatch") {
        queue.push(socket);
        if (queue.length >= 1) {
            const player1 = queue.shift();

            player1?.send("matched");

            // signal pregame via NATS
        }
    }
}

export { handleQuickMatch };
