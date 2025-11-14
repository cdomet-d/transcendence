import type { ImgData } from "../types-interfaces";

export class PongCourt extends HTMLDivElement {
	#assets: ImgData[] | null;
	#canva: HTMLCanvasElement;

	constructor() {
		super();
		this.#assets = null;
		this.#canva = document.createElement('canvas');
		this.id = 'pongcourt'
	}

	set assets(assets: ImgData[]) {
		this.#assets = assets;
	}

	get assets(): ImgData[] | null {
		return this.#assets;
	}

	get canva(): HTMLCanvasElement {
		return this.#canva;
	}

	connectedCallback() {
		this.append(this.#canva)
		this.render();
	}

	render() {
		this.className = 'w-full h-full bg-orange-200'
	}
}

if (!customElements.get('pong-court')) {
    customElements.define('pong-court', PongCourt, { extends: 'div' });
}