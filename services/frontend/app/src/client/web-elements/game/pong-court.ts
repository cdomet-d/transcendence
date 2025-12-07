import type { pongTheme } from '../types-interfaces';
import { HEIGHT, WIDTH } from '../../pong/classes/game-class';

export const farm: pongTheme = { color: '#773d16', theme: 'farm' };
export const ocean: pongTheme = { color: '#171cb0ff', theme: 'ocean' };
export const forest: pongTheme = { color: '#1c4f19ff', theme: 'forest' };
export const defaultTheme: pongTheme = { color: '#2267A3', theme: 'default' };

export class PongCourt extends HTMLDivElement {
	#canva: HTMLCanvasElement;
	#theme: pongTheme;

	constructor() {
		super();
		this.#canva = document.createElement('canvas');
		this.#canva.width = WIDTH;
		this.#canva.height = HEIGHT;
		this.#theme = defaultTheme;
		this.id = 'pongcourt';
	}

	set theme(theme: pongTheme) {
		this.#theme = theme;
	}

	get canva(): HTMLCanvasElement {
		return this.#canva;
	}

	get ctx(): CanvasRenderingContext2D | null {
		return this.#canva.getContext('2d');
	}

	connectedCallback() {
		this.append(this.#canva);
		this.render();
	}

	render() {
		this.#canva.className = 'w-full h-full z-50';
		this.className = 'pc-w pc-h brdr justify-self-center z-25';
		this.ctx ? (this.ctx.fillStyle = this.#theme.color) : console.error('Canva context not supported');
		this.ctx ? (this.ctx.strokeStyle = this.#theme.color) : console.error('Canva context not supported');

		if (this.#theme.theme === 'forest') {
			this.classList.add('forest-court-bg');
		} else if (this.#theme.theme === 'farm') {
			this.classList.add('farm-court-bg');
		} else if (this.#theme.theme === 'ocean') {
			this.classList.add('ocean-court-bg');
		} else this.classList.add('bg');
	}
}

if (!customElements.get('pong-court')) {
	customElements.define('pong-court', PongCourt, { extends: 'div' });
}
