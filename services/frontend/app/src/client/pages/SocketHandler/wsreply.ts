import { pong } from '../game/pong.ts'
import { matchmaking } from '../quickMatch/matchmaking.ts'

function wsRequest(main: HTMLElement, route: string) {
    const ws = new WebSocket(`wss://localhost:8443/api${route}`);
    console.log(route);

    ws.onopen = () => {
        console.log("WebSocket connection established!")
        ws.onmessage = (event) => {
            const message = event.data;
            console.log("Server says:", message);
            if (message.match("matched")) {
                console.log("MATCH FOUND");
                // TODO Redirect to Pong Page
                // pong(ws, main);
                ws.close();
            }
        }

        if (route === "/game/match")
            pong(ws, main);
        else if (route === "/quickMatch")
            matchmaking(ws, main);
    }

    ws.onclose = (event) => {
        console.log('Socket is closed. Reconnection attempt in 2 seconds.', event.reason);
        setTimeout(() => {
            wsRequest(main, route);
        }, 2000);
    };

    ws.onerror = (error) => {
        console.error('Socket encountered error: ', error, 'Closing socket');
        ws.close();
    };
}

export { wsRequest };
