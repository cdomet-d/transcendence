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

// function getCanvasContext(): CanvasRenderingContext2D | null {
//     // const canvas = document.getElementById('canvas') as HTMLCanvasElement;
//     const court = document.body.layoutInstance?.components.get('pongcourt') as PongCourt;
//     if (!court) {
//         console.log("%c Error: could not get 'canvas' HTMLElement!", 'color:red;'); // TODO: Make colourLog(text, colour)
//         return null;
//     }
//     const canvas = court.canva;
//     if (!canvas) {
//         console.log("%c Error: could not get 'canvas' HTMLElement!", 'color:red;'); // TODO: Make colourLog(text, colour)
//         return null;
//     }
//     console.log(canvas);
//     const ctx = canvas.getContext('2d');
//     //TODO: move this to class pong-court
//     ctx!.fillStyle = '#773d16';
//     ctx!.strokeStyle = '#773d16';
//     return ctx;
// }
