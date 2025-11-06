import { renderGame } from "./game.render.utils.js";
import { Game } from "./game.class.js";

// adding parameter to pong() and wsRequest(): gameRequest '{"userID", "gameID"}'
function pong(gameRequest: string) {

	console.log("game request obj: ", gameRequest);

	const ctx = getCanvasContext();
	if (!ctx) {
		console.log("error: context not supported");
		return; //TODO: display capibara ?
	}
	const game: Game = new Game(ctx);
	renderGame(game); //TODO: before rendering need to receive players names
	//TODO: should rendering be done after ws connection ?
	import("./ws.req.js").then(({ wsRequest }) => {
		wsRequest(game, gameRequest);
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

export { pong };