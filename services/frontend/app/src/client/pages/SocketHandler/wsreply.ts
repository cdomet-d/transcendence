import { pong } from '../game/pong.ts'
import { matchmaking } from '../quickMatch/matchmaking.ts'

function wsRequest(main: HTMLElement, route: string) {
    const ws = new WebSocket(`wss://localhost:8443/api${route}`);

    ws.onerror = (err) => {
        console.log("error:", err);
        return; //TODO: handle error properly
    }

    ws.onopen = () => {
        console.log("WebSocket connection established!")
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("message from server:", message);

            switch (route) {
                case '/game/match':
                    pong(ws, main);
                    break;
                case '/quickMatch':
                    matchmaking(ws, main);
                    break;
            }
        }
    }
}

export { wsRequest };
