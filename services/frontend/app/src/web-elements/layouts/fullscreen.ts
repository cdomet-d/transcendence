import { Layout } from "./layout.js";

export class fullscreenPage extends Layout {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.classList.add('w')
	}
}