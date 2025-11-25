import { Game } from './classes/game.class.js';
import type { keysObj, repObj } from './classes/game.interfaces.js';

export function addMessEvent(game: Game, ws: WebSocket) {
    ws.onmessage = (event) => {
        const rep: repObj = JSON.parse(event.data);
        rep._timestamp = performance.now();
        game.addReply(rep);
    };
}

export function createKeyDownEvent(keys: keysObj, horizontal: boolean) {
    return function keyDownEvent(event: KeyboardEvent): void {
        if (event.key === 'w') keys.w = true;
        if (event.key === 's') keys.s = true;
        if (horizontal && event.key === 'a') keys.a = true;
        if (horizontal && event.key === 'd') keys.d = true;
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            keys.ArrowUp = true;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            keys.ArrowDown = true;
        }
        if (horizontal && event.key === 'ArrowLeft') keys.ArrowLeft = true;
        if (horizontal && event.key === 'ArrowRight') keys.ArrowRight = true;
    };
}

export function createKeyUpEvent(keys: keysObj) {
    return function keyUpEvent(event: KeyboardEvent): void {
        event.preventDefault();
        if (event.key === 'w') keys.w = false;
        if (event.key === 's') keys.s = false;
        if (event.key === 'a') keys.a = false;
        if (event.key === 'd') keys.d = false;
        if (event.key === 'ArrowUp') keys.ArrowUp = false;
        if (event.key === 'ArrowDown') keys.ArrowDown = false;
        if (event.key === 'ArrowLeft') keys.ArrowLeft = false;
        if (event.key === 'ArrowRight') keys.ArrowRight = false;
    };
}
