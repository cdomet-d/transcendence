import type { InputFieldsData } from '../../types-interfaces';

//TODO: feedback on username
//TODO: err message on required field empty

/**
 * Custom input element.
 * Extends native HTMLInputElement.
 */
export class CustomInput extends HTMLInputElement {
    #inputCallback: (event: Event) => void;
    constructor() {
        super();
        this.#inputCallback = (event) => this.inputFeedback(event);
    }

    //TODO: allow hide on ESC
    inputFeedback(event: Event) {
        if (this.getAttribute('type') === 'password') {
            const el = event.target as HTMLInputElement;
            const pw = el.value;
            let feedback: Array<string> = [];
            if (!/[A-Z]/.test(pw)) feedback.push('missing an uppercase letter');
            if (!/[a-z]/.test(pw)) feedback.push('missing an lowercase letter');
            if (!/[0-9]/.test(pw)) feedback.push('missing an number');
            if (!/[!@#$%^&*()\-_=+{};:,<.>]/.test(pw)) feedback.push('missing a special character');
            if (pw.length < 12 || pw.length > 64)
                feedback.push(`Range for pw is 12-64, current length is: ${pw.length}`);

            this.dispatchEvent(
                new CustomEvent('validation', { detail: { feedback }, bubbles: true }),
            );
        }
    }

    connectedCallback() {
        this.addEventListener('input', this.#inputCallback);
        this.render();
    }

    disconnectedCallback() {
        this.removeEventListener('input', this.#inputCallback);
    }

    render() {
        //TODO: border color change on focus not working
        this.className = 'brdr w-full';
    }
}

if (!customElements.get('custom-input')) {
    customElements.define('custom-input', CustomInput, { extends: 'input' });
}

/**
 * Custom input label element.
 * Extends native HTMLLabelElement.
 */
export class InputLabel extends HTMLLabelElement {
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
        this.className = 'min-w-[fit-content] w-[10%] absolute left-[0px] -top-[25px]';
    }
}

if (!customElements.get('input-label')) {
    customElements.define('input-label', InputLabel, { extends: 'label' });
}

/**
 * Container element grouping input and label.
 * Extends native HTMLDivElement.
 */
export class InputGroup extends HTMLDivElement {
    #input: CustomInput;
    #label: InputLabel;
    #inputFeedback: HTMLDivElement;
    #validationCallback: (event: Event) => void;
    #info: InputFieldsData;

    /**
     * Sets input field information for label & input configuration.
     */
    set info(data: InputFieldsData) {
        this.#info = data;
    }

    get label() {
        return this.#label;
    }
    constructor() {
        super();
        this.#info = {
            labelContent: '',
            id: '',
            pattern: '',
            placeholder: '',
            type: '',
            required: true,
        };
        this.#input = document.createElement('input', { is: 'custom-input' }) as CustomInput;
        this.#label = document.createElement('label', { is: 'input-label' }) as InputLabel;
        this.#inputFeedback = document.createElement('div');
        this.#validationCallback = (event: Event) => this.displayInputFeedback(event);
    }

    displayInputFeedback(event: Event) {
        const ev = event as CustomEvent;
        if (ev.detail.feedback.length > 0) this.#inputFeedback.classList.remove('hidden');
        else this.#inputFeedback.classList.add('hidden');
        if (this.#inputFeedback.firstChild)
            this.#inputFeedback.removeChild(this.#inputFeedback.firstChild);
        const list = document.createElement('ul');
        list.className = 'pad-xs list-inside';
        for (let i: number = 0; i < ev.detail.feedback.length; i++) {
            const ul = document.createElement('li');
            ul.innerText = ev.detail.feedback[i];
            ul.className = 'list-disc';
            list.append(ul);
        }
        this.#inputFeedback.append(list);
    }

    //TODO: add disconnected callback
    connectedCallback() {
        this.addEventListener('validation', this.#validationCallback);
        this.#input.addEventListener('blur', () => {
            this.#inputFeedback.classList.add('hidden');
        });
        this.#input.addEventListener('focus', () => {
            if (this.#inputFeedback.firstChild) this.#inputFeedback.classList.remove('hidden');
        });
        this.render();
    }

    render() {
        this.appendChild(this.#label);
        this.appendChild(this.#input);
        this.appendChild(this.#inputFeedback);
        this.className = 'box-border relative w-full';

        if (this.#info.required) this.#input.setAttribute('required', '');
        this.#inputFeedback.className = 'brdr bg hidden';
        this.#label.for = this.#info.id;
        this.#info.required
            ? (this.#label.content = this.#info.labelContent + ' *')
            : (this.#label.content = this.#info.labelContent);
        this.#input.id = this.#info.id;
        this.#input.name = this.#info.id;
        this.#input.placeholder = this.#info.placeholder;
        this.#input.pattern = this.#info.pattern;
        this.#input.type = this.#info.type;
        if (this.#info.type === 'range') {
            if (this.#info.min) this.#input.min = this.#info.min;
            if (this.#info.max) this.#input.max = this.#info.max;
            if (this.#info.step) this.#input.step = this.#info.step;
            //TODO: add datalist ? => https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range#adding_tick_marks
        }
        if (this.#info.type === 'file')
            this.#input.classList.add(
                'pl-(24px)',
                'file:absolute',
                'file:top-[5px]',
                'file:left-[4px]',
                'file:w-[5rem]',
                'file:h-[26px]',
            );
    }
}
if (!customElements.get('input-and-label')) {
    customElements.define('input-and-label', InputGroup, { extends: 'div' });
}
export class TextAreaGroup extends HTMLDivElement {
    #input: HTMLTextAreaElement;
    #label: InputLabel;
    #info: InputFieldsData;
    #inputFeedback: HTMLDivElement;
    #validationCallback: (event: Event) => void;

    /**
     * Sets input field information for label & input configuration.
     */
    set info(data: InputFieldsData) {
        this.#info = data;
    }

    constructor() {
        super();
        this.#info = {
            labelContent: '',
            id: '',
            pattern: '',
            placeholder: '',
            type: '',
            required: false,
        };
        this.#input = document.createElement('textarea') as HTMLTextAreaElement;
        this.#label = document.createElement('label', { is: 'input-label' }) as InputLabel;
        this.#inputFeedback = document.createElement('div');
        this.#validationCallback = (event: Event) => this.displayInputFeedback(event);
    }

    displayInputFeedback(event: Event) {
        const ev = event as CustomEvent;
        if (ev.detail.feedback.length > 0) this.#inputFeedback.classList.remove('hidden');
        else this.#inputFeedback.classList.add('hidden');
        if (this.#inputFeedback.firstChild)
            this.#inputFeedback.removeChild(this.#inputFeedback.firstChild);
        const list = document.createElement('ul');
        list.className = 'pad-xs list-inside';
        for (let i: number = 0; i < ev.detail.feedback.length; i++) {
            const ul = document.createElement('li');
            ul.innerText = ev.detail.feedback[i];
            ul.className = 'list-disc';
            list.append(ul);
        }
        this.#inputFeedback.append(list);
    }

    connectedCallback() {
        this.addEventListener('validation', this.#validationCallback);
        this.#input.addEventListener('blur', () => {
            this.#inputFeedback.classList.add('hidden');
        });
        this.#input.addEventListener('focus', () => {
            if (this.#inputFeedback.firstChild) this.#inputFeedback.classList.remove('hidden');
        });
        this.render();
    }

    render() {
        this.appendChild(this.#label);
        this.appendChild(this.#input);
        this.appendChild(this.#inputFeedback);

        this.#input.className = 'resize-y brdr h-full pad-xs';
        this.#input.id = this.#info.id;
        this.#input.maxLength = 256;
        this.#input.name = this.#info.id;
        this.#input.placeholder = this.#info.placeholder;
        this.#inputFeedback.className = 'brdr bg hidden';
        this.#label.content = this.#info.labelContent;
        this.#label.for = this.#info.id;
        if (this.#info.required) this.#input.setAttribute('required', '');
        this.className = 'box-border relative';
    }
}

if (!customElements.get('textarea-and-label')) {
    customElements.define('textarea-and-label', TextAreaGroup, { extends: 'div' });
}
