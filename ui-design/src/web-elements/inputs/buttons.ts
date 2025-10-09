/**
 * Custom radio button element.
 * Extends HTMLDivElement.
 */
export class radioBtn extends HTMLDivElement {
    input: HTMLInputElement;
    check: HTMLSpanElement;

    /**
     * Sets the name attribute of the internal radio input.
     */
    set inputName(val: string) {
        this.input.name = val;
    }

    /**
     * Sets the id attribute of the internal radio input.
     */
    set inputId(val: string) {
        this.input.id = val;
    }

    constructor() {
        super();
        this.input = document.createElement('input');
        this.check = document.createElement('span');
        this.input.type = 'radio';
        this.input.className = 'peer z-2 absolute top-[0] left-[0] cursor-pointer';
        this.check.className =
            'thin brdr z-1 orange-bg absolute top-[0] left-[0] cursor-pointer w-[18px] h-[100%] peer-checked:absolute peer-checked:left-1/2 border-box';

        this.appendChild(this.input);
        this.appendChild(this.check);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = 'box-border relative block border-none w-[36px] h-[24px] brdr clear-bg';
    }
}

customElements.define('radio-btn', radioBtn, { extends: 'div' });

/**
 * Custom checkbox element.
 * Extends HTMLDivElement.
 */
export class checkBox extends HTMLDivElement {
    input: HTMLInputElement;
    check: HTMLSpanElement;

    /**
     * Sets the name attribute of the internal checkbox input.
     */
    set inputName(val: string) {
        this.input.name = val;
    }

    /**
     * Sets the id attribute of the internal checkbox input.
     */
    set inputId(val: string) {
        this.input.id = val;
    }

    constructor() {
        super();
        this.input = document.createElement('input');
        this.check = document.createElement('span');
        this.input.type = 'checkbox';
        this.input.className = 'peer m-0 z-2 cursor-pointer absolute top-[0] left-[0]';
        this.check.className =
            'peer-checked:block z-1 hidden absolute top-[4px] left-[4px] cursor-pointer w-[16px] h-[16px] thin brdr orange-bg';

        this.appendChild(this.input);
        this.appendChild(this.check);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = 'w-[24px] h-[24px] border-box relative block border-none brdr clear-bg';
    }
}

customElements.define('check-btn', checkBox, { extends: 'div' });
