export function gameOver(payload: string) {
    // send obj to DB
    const game: game = JSON.parse(payload);
    sendGame(game);
    // showWinnerScreen();
}

import { fetch, Agent } from 'undici';
import type { game } from '../manager.interface.js';

const sslAgent = new Agent({
    connect: { rejectUnauthorized: false }
});

async function sendGame(game: game) {
    const url = `https://dashboard:1515/game}`;
    let response: Response;

    try {
        response = await fetch(url, {
            method: 'GET',
            dispatcher: sslAgent,
            body: JSON.stringify({
                //see dashboard /game routes
            }),
        });
    } catch (error) {
        console.error(`[GM] Dashboard service (/game) is unreachable: ${error}`);
        throw new Error('Dashboard service is unreachable.');
    }

}