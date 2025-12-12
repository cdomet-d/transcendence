import { renderGame } from './game-render-utils.js';
import { Game } from './classes/game-class.js';
import { wsRequest } from './ws-req.js';
import { router, userStatus, type userStatusInfo } from '../main.js';
import type { PongUI } from '../web-elements/game/game-ui.js';
import { redirectOnError } from '../error.js';
import type { PongOptions } from '../web-elements/types-interfaces.js';
import type { PongCourt } from '../web-elements/game/pong-court.js';

export interface gameRequest {
    opponent: string;
    gameID: string;
    remote: boolean;
	gameSettings: PongOptions;
}

export async function pong(gameReq: gameRequest, court: PongCourt, ui: PongUI) {
    if (!court.ctx) {
        router.loadRoute('/404', true);
        return;
    }
    const game: Game = new Game(court.ctx, gameReq.remote, gameReq.gameSettings, ui);
    renderGame(game);
    const user: userStatusInfo = await userStatus();
    if (!user.auth || user.userID === undefined) {
        redirectOnError('/auth', 'You must be registered to see this page')
        return JSON.stringify({ event: 'BAD_USER_TOKEN'});
    }
    wsRequest(court, game, { gameID: gameReq.gameID, userID: user.userID! });
}
