import { Layout } from "./layout.js";

export class FullscreenPage extends Layout {
	constructor() {
		super();
	}

	render() {
		super.render();
		this.classList.add('grid', 'place-content-center', 'v-gap-l');
	}
}

if (!customElements.get('full-screen')) {
	customElements.define('full-screen', FullscreenPage, {extends: 'div'});
}