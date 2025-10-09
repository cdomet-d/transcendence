export class cTitle extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const level = this.getAttribute('level') || '1';
        this.render(level);
    }
    set content(val: string) {
        this.textContent = val;
    }

    render(level: string) {
        const validLevel = ['1', '2', '3'].includes(level) ? level : '1';
        this.innerHTML = `<h${validLevel}
		class="f-yellow
		text-center
		title-shadow
		t${validLevel}
		leading-[130%]">${this.textContent}</h${validLevel}>`;
    }
}
customElements.define('c-title', cTitle);
