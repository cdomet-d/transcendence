import type { CourtTheme } from '../types-interfaces';

export class PongCourt extends HTMLDivElement {
    #canva: HTMLCanvasElement;
    #theme: CourtTheme;

    constructor() {
        super();
        this.#canva = document.createElement('canvas');
        this.#theme = 'default';
        this.id = 'pongcourt';
    }

    set theme(theme: CourtTheme) {
        this.#theme = theme;
    }

    get canva(): HTMLCanvasElement {
        return this.#canva;
    }

    connectedCallback() {
        this.append(this.#canva);
        this.render();
    }

    render() {
        this.#canva.className = 'w-full h-full z-25';
        this.className = 'content-h brdr z-50';
		if (this.#theme === 'farm') this.classList.add('farm-court-bg')
    }
}

if (!customElements.get('pong-court')) {
    customElements.define('pong-court', PongCourt, { extends: 'div' });
}
