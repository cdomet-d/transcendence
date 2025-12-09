import type { pongTheme } from '../types-interfaces';
import { HEIGHT, WIDTH } from '../../pong/classes/game-class';

export const farm: pongTheme = { color: '#773d16', theme: 'farm' };
export const ocean: pongTheme = { color: '#171cb0ff', theme: 'ocean' };
export const defaultTheme: pongTheme = { color: '#2267A3', theme: 'default' };

export class PongCourt extends HTMLDivElement {
    #canva: HTMLCanvasElement;
    #theme: pongTheme;
    #pongWS: WebSocket | null;
    #lobbyWS: WebSocket | null;

    constructor() {
        super();
        this.#canva = document.createElement('canvas');
        this.#canva.width = WIDTH;
        this.#canva.height = HEIGHT;
        this.#theme = defaultTheme;
        this.id = 'pongcourt';
        this.#pongWS = null;
        this.#lobbyWS =  null
    }

    set theme(theme: pongTheme) {
        this.#theme = theme;
    }

    set pongSocket(socket: WebSocket) {
        this.#pongWS = socket;
    }

    set lobbySocket(socket: WebSocket) {
        this.#lobbyWS = socket;
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

    disconnectedCallback() {
        if (this.#pongWS !== null)
            this.#pongWS.close();
		const newRoute: string = window.location.pathname;
        if (this.#lobbyWS !== null && newRoute !== "/game" && !newRoute.includes("-lobby"))
            this.#lobbyWS.close();
    }

	render() {
		this.#canva.className = 'w-full h-full z-50';
		this.className = 'pc-w pc-h brdr justify-self-center z-25';
		this.ctx
			? (this.ctx.fillStyle = this.#theme.color)
			: console.error('Canva context not supported');
		this.ctx
			? (this.ctx.strokeStyle = this.#theme.color)
			: console.error('Canva context not supported');

		if (this.#theme.theme === 'default') {
			this.classList.add('bg');
		}
		if (this.#theme.theme === 'farm') {
			this.classList.add('farm-court-bg');
		}
	}
}

if (!customElements.get('pong-court')) {
	customElements.define('pong-court', PongCourt, { extends: 'div' });
}
