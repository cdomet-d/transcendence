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
    if (game.local)
        keys = keys.concat(["ArrowUp", "ArrowDown"]);
    console.log("keys:", keys);
    setPaddleEvent(leftPlayer, keys);
    if (!game.local)
        setPaddleEvent(rightPlayer, keys);
}

export interface keys {
	w: boolean,
	s: boolean,
	ArrowUp: boolean,
	ArrowDown: boolean,
}

function setPaddleEvent(player: Player, keys: string[]) {
    player.socket.on("message", (payload: any) => {
        const mess: keys = JSON.parse(payload);
        keys.forEach((key) => {
            // if (mess === key)
            //     paddlePos(player, mess);
        })
    })
}
