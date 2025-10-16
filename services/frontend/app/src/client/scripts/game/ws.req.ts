import { startGame } from './game.loop.js';
import { Game } from './game.class.js';

function wsRequest(game: Game) {
    const ws = new WebSocket('wss://localhost:8443/api/game/match'); //?gameID=1');

    ws.onerror = (err) => {
        console.log("error:", err);
        return; //TODO: handle error properly
    }

    ws.onopen = () => {
        console.log("WebSocket connection established!")
        ws.addEventListener('message', (event) => {
            const signal: number = JSON.parse(event.data);
            console.log("SIGNAL:", signal, "TYPE", typeof(signal));
            if (signal === 1) {
                console.log("IN");
                startGame(game, ws);
            }
        }, { once: true });
        ws.send(JSON.stringify({gameID: 1, userID: 1})); //TODO: only for testing
    }


    ws.onclose = () => {
        window.cancelAnimationFrame(game.frameId);
    }
}

export { wsRequest };
