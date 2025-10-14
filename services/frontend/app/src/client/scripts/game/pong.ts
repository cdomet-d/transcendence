import { renderGame } from "./game.render.utils.js";
import { Game } from "./game.class.js";

function pong() {
	const ctx = getCanvasContext();
	if (!ctx) {
		console.log("error: context not supported");
		return; //TODO: display capibara ?
	}
	const game: Game = new Game(ctx, true);
	renderGame(game); //TODO: before rendering need to receive players names
	//TODO: should rendering be done after ws connection ?
	import("./ws.req.js").then(({ wsRequest }) => {
        wsRequest(game);
    }) //TODO: can import fail ?
}

function getCanvasContext(): CanvasRenderingContext2D | null {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	const ctx = canvas.getContext('2d');
	return ctx;
}

// window.addEventListener("load", );

export { pong };