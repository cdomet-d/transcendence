import { pong } from '../game/pong.ts'
import { matchmaking } from '../quickMatch/matchmaking.ts'

function wsRequest(main: HTMLElement, route: string) {
    const ws = new WebSocket(`wss://localhost:8443/api${route}`);
    console.log(route);

    ws.onerror = (err) => {
        console.log("error:", err);
        return; //TODO: handle error properly
    }

    ws.onopen = () => {
        console.log("WebSocket connection established!")
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("message from server:", message);
            if (message.match("matched"))
                console.log("MATCH FOUND");
        }

        if (route === "/game/match")
            pong(ws, main);
        else if (route === "/quickMatch")
            matchmaking(ws, main);
    }
}

export { wsRequest };
