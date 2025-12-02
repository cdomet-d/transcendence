import { renderGame } from './game-render-utils.js';
import { Game } from './classes/game-class.js';
import { wsRequest } from './ws-req.js';
import { router, userStatus, type userStatusInfo } from '../main.js';
import type { PongUI } from '../web-elements/game/game-ui.js';
import { redirectOnError } from '../error.js';
import type { PongOptions } from '../web-elements/types-interfaces.js';

export interface gameRequest {
    opponent: string,
    gameID: string;
    remote: boolean;
	gameSettings: PongOptions;
}

export async function pong(gameReq: gameRequest, ctx: CanvasRenderingContext2D | null, ui: PongUI) {
    console.log('game request obj: ', gameReq);

    if (!ctx) {
        console.log('error: context not supported');
        router.loadRoute('/404', true);
        return;
    }
    const game: Game = new Game(ctx, gameReq.remote, true, ui);
    // UI has the player names defined + has a default score of 0 for each player
    renderGame(game);

    const user: userStatusInfo = await userStatus();
    if (!user.auth) {
        redirectOnError('/auth', 'You must be registered to see this page')
        return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    }
    if (user.userID === undefined) {
        //TODO: why could it be undefined?
        return;
    }

    wsRequest(game, { gameID: gameReq.gameID, userID: user.userID! });
}
