/**
 * Custom radio button element.
 * Extends HTMLDivElement.
 */
export class RadioButton extends HTMLDivElement {
    #input: HTMLInputElement;
    #check: HTMLSpanElement;

    constructor() {
        super();
        this.#input = document.createElement('input');
        this.#check = document.createElement('span');
    }

    /**
     * Sets the name attribute of the internal radio input.
     */
    set inputName(val: string) {
        this.#input.name = val;
    }

    /**
     * Sets the id attribute of the internal radio input.
     */
    set inputId(val: string) {
        this.#input.id = val;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.append(this.#input, this.#check);
        this.#input.type = 'radio';
        this.#input.className = 'peer z-2 absolute top-[0] left-[0] cursor-pointer';
        this.#check.className =
            'thin brdr z-1 orange-bg absolute top-[0] left-[0] cursor-pointer w-[18px] h-full peer-checked:absolute peer-checked:left-1/2 box-border';
        this.className = 'box-border relative block border-none w-[36px] h-[24px] brdr bg';
    }
}
if (!customElements.get('radio-button')) {
    customElements.define('radio-button', RadioButton, { extends: 'div' });
}

/**
 * Custom Checkbox element.
 * Extends HTMLDivElement.
 */
export class Checkbox extends HTMLDivElement {
    #input: HTMLInputElement;
    #check: HTMLSpanElement;

    constructor() {
        super();
        this.#input = document.createElement('input');
        this.#check = document.createElement('span');
    }

    connectedCallback() {
        this.render();
    }

    /**
     * Sets the name attribute of the internal Checkbox input.
     */
    set inputName(val: string) {
        this.#input.name = val;
    }

    /**
     * Sets the id attribute of the internal Checkbox input.
     */
    set inputId(val: string) {
        this.#input.id = val;
    }

    render() {
        this.append(this.#input, this.#check);
        this.#input.type = 'Checkbox';
        this.#input.className = 'peer m-0 z-2 cursor-pointer absolute top-[0] left-[0]';
        this.#check.className =
            'peer-checked:block z-1 hidden absolute top-[4px] left-[4px] cursor-pointer w-[16px] h-[16px] thin brdr orange-bg';
        this.className = 'w-[24px] h-[24px] box-border relative block border-none brdr bg';
    }
}

if (!customElements.get('checkbox-input')) {
    customElements.define('checkbox-input', Checkbox, { extends: 'div' });
}
