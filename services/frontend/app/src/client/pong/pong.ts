import { renderGame } from './game.render.utils.js';
import { Game } from './classes/game.class.js';
import { wsRequest } from './ws.req.js';
import { router } from '../main.js';

export interface gameRequest {
    userID: number;
    gameID: number;
    remote: boolean;
}

export function pong(gameReq: gameRequest, ctx: CanvasRenderingContext2D | null) {
    console.log('game request obj: ', gameReq);

    if (!ctx) {
        console.log('error: context not supported');
        router.loadRoute('/404');
        return;
    }
    const game: Game = new Game(ctx, gameReq.remote, false);
    renderGame(game); //TODO: before rendering need to receive players names
    //TODO: window.addEventListener("load", (event) => {
    wsRequest(game, { gameID: gameReq.gameID, userID: gameReq.userID });
    // });
}
