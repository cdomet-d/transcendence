import { createKeyDownEvent} from './paddle.js'

function wsRequest() {
    document.cookie = "gameid=1;path=/;max-age=31536000";
    document.cookie = "userid=1;path=/;max-age=31536000";
    document.cookie = "randuserid=2;path=/;max-age=31536000";

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
        window.addEventListener("keydown", createKeyDownEvent(ws));
    }
}

export { wsRequest };