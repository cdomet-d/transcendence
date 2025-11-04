import { renderGame } from "./game.render.utils.js";
import { Game } from "./game.class.js";

interface gameRequest {
	event: string,
	userID: number,
	gameID: number
}

// adding parameter to pong() and wsRequest(): gameRequest '{"userID", "gameID"}'
export function pong(gameRequest: gameRequest) {
	console.log("game request obj: ", gameRequest);

	const ctx = getCanvasContext();
	if (!ctx) {
		console.log("error: context not supported");
		return; //TODO: display capibara ?
	}
	const game: Game = new Game(ctx, false); //TODO: need to know if game is local or remote
	renderGame(game); //TODO: before rendering need to receive players names
	import("./ws.req.js").then(({ wsRequest }) => {
		wsRequest(game, {gameID: gameRequest.gameID, userID: gameRequest.userID});
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
