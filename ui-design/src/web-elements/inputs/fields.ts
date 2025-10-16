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
    #inputCallback: (event: Event) => void;
    constructor() {
        super();
        this.#inputCallback = (event) => this.inputFeedback(event);
    }

    inputFeedback(event: Event) {
        if (this.getAttribute('type') === 'password') {
            const el = event.target as HTMLInputElement;
            const pw = el.value;
            let feedback: Array<string> = [];
            if (!/[A-Z]/.test(pw)) feedback.push('missing an uppercase letter');
            if (!/[a-z]/.test(pw)) feedback.push('missing an lowercase letter');
            if (!/[0-9]/.test(pw)) feedback.push('missing an number');
            if (!/[!@#$%^&*()\-_=+{};:,<.>]/.test(pw)) feedback.push('missing a special character');
            if (pw.length < 8 || pw.length > 64)
                feedback.push(`Range for pw is 12-64, current length is: ${pw.length}`);
			
            this.dispatchEvent(new CustomEvent('validation', {detail: { feedback }, bubbles: true}));
        }
    }

    connectedCallback() {
        this.addEventListener('input', this.#inputCallback);
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
    #type: string;
    constructor() {
        super();
        this.#type = 'text';
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

    set type(type: string) {
        this.#type = type;
    }

    render() {
        this.className = 'min-w-[fit-content] flex justify-center brdr clear-bg thin w-[10%]';
        if (this.#type != 'range') {
            this.classList.add('absolute', 'right-[8px]', '-top-[10px]');
        }
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
	#validationCallback: (error: string[]) => void
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
		this.#validationCallback = (error: string[]) => this.displayInputFeedback(error)
        this.appendChild(this.#label);
        this.appendChild(this.#input);
    }

	displayInputFeedback(error: Array<string>) {
	
	}
    set isSearchbar(val: boolean) {
        if (val) {
            this.#input.classList.add('searchbar-padding');
            this.render();
        }
    }

    connectedCallback() {
		this.addEventListener('validation', this.#validationCallback);
        this.render();
    }

    render() {
        this.className = 'w-full box-border relative min-w-[240px]';
        this.#label.for = this.#info.id;
        this.#label.type = this.#info.type;
        this.#label.content = this.#info.labelContent;
        this.#input.id = this.#info.id;
        this.#input.placeholder = this.#info.placeholder;
        this.#input.pattern = this.#info.pattern;
        this.#input.type = this.#info.type;
        if (this.#info.type === 'range') {
            if (this.#info.min) this.#input.min = this.#info.min;
            if (this.#info.max) this.#input.max = this.#info.max;
            if (this.#info.step) this.#input.step = this.#info.step;
        }
    }
}

customElements.define('input-grp', inputGroup, { extends: 'div' });
