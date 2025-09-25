import { Game, type keysObj} from './game.class.js'

interface repObj {
	leftPad: number | undefined,
	rightPad: number | undefined,
}

export function addMessEvent(game: Game, ws: WebSocket) {
	ws.onmessage = (event) => {
		const mess: repObj = JSON.parse(event.data);
		let newPos: number | undefined = mess.leftPad;
		if (newPos)
			game.leftPad.y = newPos;
		newPos = mess.rightPad;
		if (newPos)
			game.rightPad.y = newPos;
	};
}

export function createKeyDownEvent(keys: keysObj)  {
	return function keyDownEvent(event: KeyboardEvent): void {
		event.preventDefault();
		if (event.key === "w")
			keys._w = true;
		if (event.key === "s")
			keys._s = true;
		if (event.key === "ArrowUp")
			keys._ArrowUp = true;
		if (event.key === "ArrowDown")
			keys._ArrowDown = true;
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
