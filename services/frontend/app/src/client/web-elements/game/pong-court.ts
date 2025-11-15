export class PongCourt extends HTMLDivElement {
    #canva: HTMLCanvasElement;

    constructor() {
        super();
        this.#canva = document.createElement('canvas');
        this.id = 'pongcourt';
    }

    get canva(): HTMLCanvasElement {
        return this.#canva;
    }

    connectedCallback() {
        this.append(this.#canva);
        this.render();
    }

    render() {
        this.#canva.className = 'w-full h-full bg z-25';
        this.className = 'content-h w-[1117.8px] brdr';
    }
}

if (!customElements.get('pong-court')) {
    customElements.define('pong-court', PongCourt, { extends: 'div' });
}
