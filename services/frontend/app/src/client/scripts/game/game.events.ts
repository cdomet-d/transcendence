import { Game, type keysObj} from './game.class.js'

interface repObj {
	leftPadY: number,
	rightPadY: number,
}

export function addMessEvent(game: Game, ws: WebSocket) {
	ws.onmessage = (event) => {
		const mess: repObj = JSON.parse(event.data);
		game.leftPad.y = mess.leftPadY;
		game.rightPad.y = mess.rightPadY;
	};
}

export function createKeyDownEvent(keys: keysObj)  {
	return function keyDownEvent(event: KeyboardEvent): void {
		if (event.key === "w")
			keys._w = true;
		if (event.key === "s")
			keys._s = true;
		if (event.key === "ArrowUp") {
			event.preventDefault();
			keys._ArrowUp = true;
		}
		if (event.key === "ArrowDown") {
			event.preventDefault();
			keys._ArrowDown = true;
		}
	}
}

export function createKeyUpEvent(keys: keysObj)  {
	return function keyUpEvent(event: KeyboardEvent): void {
		event.preventDefault();
		if (event.key === "w")
			keys._w = false;
		if (event.key === "s")
			keys._s = false;
		if (event.key === "ArrowUp")
			keys._ArrowUp = false;
		if (event.key === "ArrowDown")
			keys._ArrowDown = false;
	}
}
