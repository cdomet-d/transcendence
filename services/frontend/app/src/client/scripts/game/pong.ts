import { renderGame } from "./game.render.utils.js";
import { Game } from "./game.class.js";
import { wsRequest } from "./ws.req.js";

export interface gameRequest {
	userID: number,
	gameID: number,
	remote: boolean
}

export function pong(gameReq: gameRequest) {
	console.log("game request obj: ", gameReq);

	const ctx = getCanvasContext();
	if (!ctx) {
		console.log("error: context not supported");
		return;
	}
	const game: Game = new Game(ctx, gameReq.remote, false);
	//TODO: set strokeStyle and fillStyle //changes paddle and ball colour
	renderGame(game); //TODO: before rendering need to receive players names
	// window.addEventListener("load", (event) => {
		wsRequest(game, {gameID: gameReq.gameID, userID: gameReq.userID});
	// });
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

