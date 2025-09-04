import type { WebSocket } from '@fastify/websocket';

function pairUp(socket: WebSocket, message: string) {
    socket.send("yo bro");
}

export { pairUp };

/*
import type { WebSocket } from '@fastify/websocket';

function handleMatchMaking(socket: WebSocket, message: String) {
    console.log("Hi, I'm server side code that handles matchmaking.")
    let queue: WebSocket[] = [];
    if (message === "join_queue") {
        queue.push(socket);
        socket.send("waiting for match...");
        if (queue.length >= 2) {
            const player1 = queue.shift();
            const player2 = queue.shift();
            
            player1?.send("matched");
            player2?.send("matched");
            
            // Signal PreGame service through NATS
        }
    }
    // Handle errors
}

export { handleMatchMaking };
*/