import type { WebSocket } from '@fastify/websocket';
import type { Game } from '../classes/game.class.js';
import { paddlePos } from './paddle.js';
import type { Player } from '../classes/player.class.js';

export function setUpGame(game: Game) {
    game.players[0]?.setLeftPaddle();
    game.players[1]?.setRightPaddle();

    //TODO: send info to display game screen (users names) or is it gameManager's job?
    startGame(game);
}

function startGame(game: Game) {
    const leftPlayer = game.players[0];
    const rightPlayer = game.players[1];
    if (!leftPlayer || !rightPlayer)
        return;

    let keys: string[] = ["w", "s"];
    setPaddleEvent(leftPlayer, keys);
    if (game.local)
        keys = ["ArrowUp", "ArrowDown"];
    setPaddleEvent(rightPlayer, keys);
}

function setPaddleEvent(player: Player, keys: string[]) {
    player.socket.on("message", (payload: any) => {
        const mess: string = payload.toString();
		if (mess === keys[0] || mess === keys[1])
			paddlePos(player, mess);
    })
}
