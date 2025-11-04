import { renderGame } from "./game.render.utils.js";
import { Game } from "./game.class.js";

export interface idsObj {
	userID: number,
	gameID: number
}

export function pong(ids: idsObj) {
	console.log("game request obj: ", ids);

	const ctx = getCanvasContext();
	if (!ctx) {
		console.log("error: context not supported");
		return; //TODO: display capibara ?
	}
	const game: Game = new Game(ctx, false); //TODO: need to know if game is local or remote
	renderGame(game); //TODO: before rendering need to receive players names
	import("./ws.req.js").then(({ wsRequest }) => {
		wsRequest(game, ids);
	}) //TODO: can import fail ?
}

function getCanvasContext(): CanvasRenderingContext2D | null {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	if (!canvas) {
		console.log("%c Error: could not get 'canvas' HTMLElement!", "color:red;") // TODO: Make colourLog(text, colour)
		return null;
	}

	const ctx = canvas.getContext('2d');
	return ctx;
}

//TODO: window.addEventListener("load", );
