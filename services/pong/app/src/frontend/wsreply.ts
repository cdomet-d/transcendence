import { pong } from './pong.js'

function wsRequest() {
    const ws = new WebSocket('wss://localhost:8443/game/match');

    ws.onerror = (err) => {
        console.log("error:", err);
        process.exit(1); //TODO: replace exit
    }

    ws.onopen = () => {
        console.log("WebSocket connection established!")
        ws.onmessage = (event) => {
            console.log("message from server:", event.data);
        }
        pong(ws);
    }
}

wsRequest();