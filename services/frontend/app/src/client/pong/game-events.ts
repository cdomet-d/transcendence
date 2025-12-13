import { Game } from './classes/game-class.js';
import type { keysObj, repObj } from './classes/game-interfaces.js';

export function addMessEvent(game: Game, ws: WebSocket) {
	ws.onmessage = (event) => {
		const rep: repObj = JSON.parse(event.data);
		rep.timestamp = performance.now();
		game.addReply(rep);
	};
}

export function createKeyEvent(keys: keysObj, local: boolean, horizontal: boolean, isKeyDown: boolean) {
	const keyMap = {
		w: ['w', 'W'],
		s: ['s', 'S'],
		a: horizontal ? ['a', 'A'] : [],
		d: horizontal ? ['d', 'D'] : [],
		ArrowUp: local ? ['ArrowUp'] : [],
		ArrowDown: local ? ['ArrowDown'] : [],
		ArrowLeft: horizontal && local ? ['ArrowLeft'] : [],
		ArrowRight: horizontal && local ? ['ArrowRight'] : [],
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
