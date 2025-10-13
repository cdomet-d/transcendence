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
        ws.send(JSON.stringify({gameID: 1, userID: 1})); //TODO: only for testing
        // startGame(game, ws);
    }

    ws.addEventListener('message', (event) => {
        const signal = Number(event.data);
        if (signal === 1)
            startGame(game, ws);
    }, { once: true });

    ws.onclose = () => {
        window.cancelAnimationFrame(game.frameId);
    }
}

export { wsRequest };
