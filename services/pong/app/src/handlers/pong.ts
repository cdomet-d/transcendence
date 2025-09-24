import type { Game, playerTab } from '../classes/game.class.js';
import { updatePaddlePos } from './paddle.js';
import type { Player, messObj } from '../classes/player.class.js';
import type { WebSocket } from 'ws';

export interface keysObj {
	w: boolean,
	s: boolean,
	ArrowUp: boolean,
	ArrowDown: boolean,
    [key: string]: boolean,
}

export function setUpGame(game: Game) {
    game.setLeftPaddle();
    game.setRightPaddle();

    if (!game.players[0] || !game.players[1])
            return; //TODO: deal with that
    const leftPlayer: Player = game.players[0];
    const rightPlayer: Player = game.players[1];
    if (game.local)
        setPaddleEventLocal(leftPlayer.socket, leftPlayer, rightPlayer);
    else {
        setPaddleEventRemote(leftPlayer, rightPlayer, "left");
        setPaddleEventRemote(rightPlayer, leftPlayer, "right");
    }

    //TODO: send info to display game screen (users names) or is it gameManager's job?
    // startGame(game);
}

function keysDown(keys: keysObj): boolean {
    for (const key in keys) {
        if (keys[key])
            return true;
    }
    return false
}

function setPaddleEventLocal(socket: WebSocket, leftPlayer: Player, rightPlayer: Player) {
    socket.on("message", (payload: any) => {
        const keys: keysObj = JSON.parse(payload);
        if (!keysDown(keys))
            return;
        updatePaddlePos(leftPlayer, {w: keys.w, s: keys.s, ArrowUp: false, ArrowDown: false});
        updatePaddlePos(rightPlayer, {w: false, s: false, ArrowUp: keys.ArrowUp, ArrowDown: keys.ArrowDown});
        leftPlayer.setMess("left", leftPlayer.paddle.y);
        leftPlayer.setMess("right", rightPlayer.paddle.y);
        const rep: messObj = leftPlayer.mess;
        socket.send(JSON.stringify(rep));
    })
}

function setPaddleEventRemote(sender: Player, receiver: Player, side: string) {
    sender.socket.on("message", (payload: any) => {
        const keys: keysObj = JSON.parse(payload);
        updatePaddlePos(sender, keys);
        sender.setMess(side, sender.paddle.y);
        const rep: messObj = sender.mess;
        if (sender.socket.readyState === 1)
            sender.socket.send(JSON.stringify(rep));
        if (receiver.socket.readyState === 1)
            receiver.socket.send(JSON.stringify(rep));
    })
}



// function setMessEvent(socket: WebSocket, callback: Function) {
//     socket.on("message", (payload: any) => {
//         const mess: keys = JSON.parse(payload);
//     })
// }