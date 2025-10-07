import { createBtn } from '../../web-element-helpers/navigation/nav-helper-modules';

export interface Button {
    role: string;
    content: string;
}

export type MenuStyle = 'vertical' | 'horizontal';

export class Menu extends HTMLDivElement {
    #elements: Array<Button>;
    #style: MenuStyle;
    constructor() {
        super();
        this.#elements = [];
        this.#style = 'horizontal';
    }

    set MenuElements(list: Array<Button>) {
        this.#elements = list;
    }
    set MenuStyle(style: MenuStyle) {
        this.#style = style;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        console.log(this.#style);
        this.className = 'gap-s box-border grid justify-items-center auto-cols-fr auto-rows-fr';
        if (this.#style === 'horizontal') this.classList.add('grid-flow-col');
        if (this.#style === 'vertical') this.classList.add('grid-flow-rows');

        this.#elements.forEach((item) => this.appendChild(createBtn(item)));
    }
}

customElements.define('menu-wrapper', Menu, { extends: 'div' });
