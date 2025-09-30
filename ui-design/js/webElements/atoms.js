export class menuButton extends HTMLButtonElement {
    constructor() {
        super();
    }
    connectedCallback(value) {
        this.render(value);
    }
    render(value) {
        document.createElement("button");
        this.classList.add("w-[100%]", "h-[90%]", "brdr", "yellow-bg", "input-emphasis", "overflow-hidden", "outline-hidden", "border-box", "flex", "justify-center", "items-center");
        this.textContent = value;
    }
}
customElements.define('menu-button', menuButton, { extends: 'button' });
//# sourceMappingURL=atoms.js.map