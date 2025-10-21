import { startGame } from './game.loop.js';
import { Game } from './game.class.js';
import type { startObj } from './mess.validation.js';
import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./game.events.js";

export function wsRequest(game: Game) {
    const ws = new WebSocket('wss://localhost:8443/api/game/match'); //?gameID=1');

    ws.onerror = (err) => {
        console.log("error:", err);
        return; //TODO: handle error properly
    }

    ws.onopen = () => {
        console.log("WebSocket connection established!")
        ws.addEventListener('message', (event) => {
            const signal: number = JSON.parse(event.data);
            // console.log("SIGNAL:", signal, "TYPE", typeof(signal));
            if (signal === 1)
                getOffset(game, ws);
        }, { once: true });
        ws.send(JSON.stringify({gameID: 1, userID: 1})); //TODO: only for testing
    }

    ws.onclose = () => {
        window.cancelAnimationFrame(game.frameId);
    }
}

export async function getOffset(game: Game, ws: WebSocket) {
    //send client timestamp
    ws.send(JSON.stringify(performance.now()));

    // wait for server timestamp and delay
    const start: startObj = await waitForMessage(ws);
    const recvTime: number = performance.now();
    const halfTripTime: number = (recvTime - start.clientTimeStamp) / 2;
    const offset: number = start.serverTimeStamp + halfTripTime - recvTime;

    // wait
    setUpGame(game, ws, start);
    const waitTime = Math.max(0, start.delay - halfTripTime);
    await new Promise(res => setTimeout(res, waitTime));

    //start game
    startGame(game, ws, offset);
}

function setUpGame(game: Game, ws: WebSocket, start: startObj) {
    game.ball.dx *= start.ballDir;
    game.ball.lastdx *= start.ballDir;
    addMessEvent(game, ws);
    window.addEventListener("keydown", createKeyDownEvent(game.req._keys));
    window.addEventListener("keyup", createKeyUpEvent(game.req._keys));
}

function waitForMessage(socket: WebSocket): Promise< startObj > {
    return new Promise((resolve, reject) => {
        socket.addEventListener('message', (event) => {
            try {
                const start: startObj = JSON.parse(event.data);
                // if (!validStart())
                // 	reject(new Error("Invalid start"));
                resolve(start);
            } catch (err) {
                reject(err);
            }
        }, { once: true });
    });
}
