import type { WebSocket } from '@fastify/websocket';
import type { FastifyRequest } from 'fastify';

// function handleQuickMatch(client: WebSocket, message: string, req: FastifyRequest) {
//     const wss = req.server.websocketServer;

//     console.log(wss.clients.size, " CLIENT LIST\n");

//     let timeout = setTimeout((client) => connectionTimedOut, 10000);

//     if (message === "create 1vs1") {
//         if (wss.clients.size >= 2) {
//             clearTimeout(timeout);

//             wss.clients.forEach((client: any) => {
//                 client.userId = Math.floor(Math.random() * 10);
//             });

//             wss.clients.forEach((c: any) => {
//                 if (c !== client && client.readyState === WebSocket.OPEN)
//                     c.send("matched");
//         });
//         }
//         // signal pregame via NATS
//     }
// }


let queue: WebSocket[] = [];
function handleQuickMatch(socket: WebSocket, message: string, req: FastifyRequest ) {
    let timeout = setTimeout((socket) => connectionTimedOut, 10000);

    if (message === "create 1vs1") {
        queue.push(socket);
        if (queue.length >= 2) {
            const player1 = queue.shift();
            const player2 = queue.shift();

            clearTimeout(timeout);

            if (socket.readyState === WebSocket.OPEN) {
                player1?.send("matched");
                player2?.send("matched");
            }
            // signal pregame via NATS
        }
    }
}

function connectionTimedOut(socket: WebSocket) {
    console.log("Could not find an opponent.\nMatchup canceled..");
    if (socket.readyState === WebSocket.OPEN)
        socket?.send("canceled");
    return;
}

export { handleQuickMatch };
