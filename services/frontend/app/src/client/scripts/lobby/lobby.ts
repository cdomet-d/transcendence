import { renderLobby } from "../../pages/html.pages.js";

export function lobby() {
	renderLobby();
	import("./wsConnect.js").then(({ wsConnect }) => {
		wsConnect();
	})
}