import { Game, type keysObj} from './game.class.js'
import { validRep, type repObj } from './mess.validation.js';

export function addMessEvent(game: Game, ws: WebSocket) {
	ws.onmessage = (event) => {
		const rep: repObj = JSON.parse(event.data);
		// if (!validRep(rep)) {
		// 	console.log("Error: invalid reply:", JSON.stringify(rep));
		// 	return
		// } //TODO: fix validRep
		rep._timestamp = performance.now();
		game.addReply(rep);
	};
}

export function createKeyDownEvent(keys: keysObj) {
	return function keyDownEvent(event: KeyboardEvent): void {
		if (event.key === "z")
			keys._w = true;
		if (event.key === "s")
			keys._s = true;
		if (event.key === "q")
			keys._a = true;
		if (event.key === "d")
			keys._d = true;
		if (event.key === "ArrowUp") {
			event.preventDefault();
			keys._ArrowUp = true;
		}
		if (event.key === "ArrowDown") {
			event.preventDefault();
			keys._ArrowDown = true;
		}
		if (event.key === "ArrowLeft")
			keys._ArrowLeft = true;
		if (event.key === "ArrowRight")
			keys._ArrowRight = true;
	}
}

export function createKeyUpEvent(keys: keysObj) {
	return function keyUpEvent(event: KeyboardEvent): void {
		event.preventDefault();
		if (event.key === "w")
			keys._w = false;
		if (event.key === "s")
			keys._s = false;
		if (event.key === "a")
			keys._a = false;
		if (event.key === "d")
			keys._d = false;
		if (event.key === "ArrowUp")
			keys._ArrowUp = false;
		if (event.key === "ArrowDown")
			keys._ArrowDown = false;
		if (event.key === "ArrowLeft")
			keys._ArrowLeft = false;
		if (event.key === "ArrowRight")
			keys._ArrowRight = false;
	}
}
