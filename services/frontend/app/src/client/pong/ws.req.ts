import { startGame } from './game.loop.js';
import { Game, WIDTH, HEIGHT } from './classes/game.class.js';
import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from './game.events.js';
import { renderGame } from './game.render.utils.js';

const START_DELAY = 500;

export function wsRequest(game: Game, ids: { gameID: number; userID: number }) {
    const ws = new WebSocket('wss://localhost:8443/api/game/');

    ws.onerror = (err) => {
        console.log('error:', err);
        return; //TODO: handle error properly
    };

    ws.onopen = () => {
        console.log('PONG webSocket connection established!');
        ws.addEventListener(
            'message',
            (event) => {
                const signal: number = JSON.parse(event.data);
                if (signal === 1 || signal === -1) setUpGame(game, ws, signal);
            },
            { once: true },
        );
        ws.send(JSON.stringify(ids));
    };

    ws.onclose = () => {
        console.log("SCORE IN CLOSE:", JSON.stringify(game.score));
        game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        renderGame(game);
        window.cancelAnimationFrame(game.frameId);
    };
}

async function setUpGame(game: Game, ws: WebSocket, ballDir: number) {
    game.ball.dx *= ballDir;
    addMessEvent(game, ws);
    window.addEventListener('keydown', createKeyDownEvent(game.req._keys, game.horizontal));
    window.addEventListener('keyup', createKeyUpEvent(game.req._keys));

    await new Promise((res) => setTimeout(res, START_DELAY));
    startGame(game, ws);
}
