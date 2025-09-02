import { pong } from './pong.js'

function wsRequest() {
    const ws = new WebSocket('wss://localhost:8443/api/game/match');
    // const ws = new WebSocket('ws://localhost:2020/game/match');

    ws.onerror = (err) => {
        console.log("error:", err);
        return; //TODO: handle error properly
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