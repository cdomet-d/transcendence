import type { InputMetadata } from '../../types-interfaces';

/**
 * Custom file upload input element.
 * Extends native HTMLInputElement.
 */
export class fileUpload extends HTMLInputElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className =
            'brdr relative file:absolute file:top-[12%] file:left-[0.5rem] file:w-[5rem] file:h-[75%]';
    }
}

customElements.define('file-upload', fileUpload, { extends: 'input' });

/**
 * Custom text input element.
 * Extends native HTMLInputElement.
 */
export class textInput extends HTMLInputElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.classList.add('brdr');
    }
}

customElements.define('text-input', textInput, { extends: 'input' });

/**
 * Custom input label element.
 * Extends native HTMLLabelElement.
 */
export class inputLabel extends HTMLLabelElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    /**
     * Sets the label text content.
     */
    set content(val: string) {
        this.textContent = val;
    }
    /**
     * Sets the label id for grouping with input.
     */
    set for(val: string) {
        this.setAttribute('for', val);
    }

    render() {
        this.className =
            'min-w-[fit-content] flex justify-center brdr clear-bg thin absolute right-[8px] -top-[8px] w-[10%]';
    }
}

customElements.define('input-label', inputLabel, { extends: 'label' });

/**
 * Container element grouping input and label.
 * Extends native HTMLDivElement.
 */
export class inputGroup extends HTMLDivElement {
    #input: textInput;
    #label: inputLabel;
    #info: InputMetadata;

    /**
     * Sets input field information for label & input configuration.
     */
    set info(data: InputMetadata) {
        this.#info = data;
    }

    constructor() {
        super();

        this.#info = {
            labelContent: 'Username',
            id: 'username',
            pattern: '^[a-zA-Z0-9]{3,10}$',
            placeholder: 'Enter your username',
            type: 'text',
        };
        this.#input = document.createElement('input', { is: 'text-input' }) as textInput;
        this.#label = document.createElement('label', { is: 'input-label' }) as inputLabel;

        this.appendChild(this.#input);
        this.appendChild(this.#label);
    }

    set isSearchbar(val: boolean) {
        if (val) this.#input.classList.add('searchbar-padding');
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = 'w-full box-border relative';
        this.#label.for = this.#info.id;
        this.#label.content = this.#info.labelContent;
        this.#input.id = this.#info.id;
        this.#input.placeholder = this.#info.placeholder;
        this.#input.pattern = this.#info.pattern;
        this.#input.type = this.#info.type;
    }
}

customElements.define('input-grp', inputGroup, { extends: 'div' });
