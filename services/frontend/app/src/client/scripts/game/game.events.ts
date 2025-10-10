import { Game, type keysObj} from './game.class.js'
import { validRep, type repObj } from './mess.validation.js';

export function addMessEvent(game: Game, ws: WebSocket) {
	ws.onmessage = (event) => {
		const mess: repObj = JSON.parse(event.data);
		if (!validRep(mess)) {
			console.log("Error: invalid message:", JSON.stringify(mess));
			return
		}
		game.leftPad = mess.leftPad.y;
		game.rightPad = mess.rightPad.y;
		game.ball = mess.ball;
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
