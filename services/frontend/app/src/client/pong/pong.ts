import { renderGame } from './game-render-utils.js';
import { Game } from './classes/game-class.js';
import { wsRequest } from './ws-req.js';
import { router } from '../main.js';
import type { PongUI } from '../web-elements/game/game-ui.js';

export interface gameRequest {
    userID: number;
    gameID: string;
    remote: boolean;
}

export function pong(gameReq: gameRequest, ctx: CanvasRenderingContext2D | null, ui: PongUI) {
    console.log('game request obj: ', gameReq);

    if (!ctx) {
        console.log('error: context not supported');
        router.loadRoute('/404', true);
        return;
    }
    const game: Game = new Game(ctx, gameReq.remote, true, ui);
    // UI has the player names defined + has a default score of 0 for each player
    renderGame(game);
    wsRequest(game, { gameID: gameReq.gameID, userID: gameReq.userID });
}
