import { Game } from './classes/game-class.js';
import type { keysObj, repObj } from './classes/game-interfaces.js';

export function addMessEvent(game: Game, ws: WebSocket) {
	ws.onmessage = (event) => {
		const rep: repObj = JSON.parse(event.data);
		rep.timestamp = performance.now();
		game.addReply(rep);
	};
}

export function createKeyEvent(keys: keysObj, horizontal: boolean, isKeyDown: boolean) {
    const keyMap = {
        w: ['z', 'Z'],
        s: ['s', 'S'],
        a: horizontal ? ['q', 'Q'] : [],
        d: horizontal ? ['d', 'D'] : [],
        ArrowUp: ['ArrowUp'],
        ArrowDown: ['ArrowDown'],
        ArrowLeft: horizontal ? ['ArrowLeft'] : [],
        ArrowRight: horizontal ? ['ArrowRight'] : []
    };

    return function keyEvent(event: KeyboardEvent): void {
        for (const [key, values] of Object.entries(keyMap)) {
            if (values.includes(event.key)) {
                keys[key] = isKeyDown;
                if (key.startsWith('Arrow')) event.preventDefault();
            }
        }
    };
}
