import { pong } from './pong.js'

function wsRequest(main: HTMLElement) {
    const ws = new WebSocket('wss://localhost:8443/api/game/match');

    ws.onerror = (err) => {
        console.log("error:", err);
        return; //TODO: handle error properly
    }

    ws.onopen = () => {
        console.log("WebSocket connection established!")
        ws.onmessage = (event) => {
            console.log("message from server:", event.data);
        }
        pong(ws, main);
    }
}

export { wsRequest };