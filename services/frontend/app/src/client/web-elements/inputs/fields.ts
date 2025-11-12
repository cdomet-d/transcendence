import type { InputFieldsData } from '../types-interfaces.js';

//TODO: feedback on username
//TODO: err message on required field empty

/**
 * Custom input element.
 * Extends native HTMLInputElement.
 */
export class CustomInput extends HTMLInputElement {
    #inputCallback: (event: Event) => void;
    #inputValidation: Map<string, (el: HTMLInputElement) => string[]>;

    constructor() {
        super();
        this.#inputCallback = (event) => this.inputFeedback(event);
        this.#inputValidation = new Map<string, (el: HTMLInputElement) => string[]>();

        this.#inputValidation.set('password', this.#typePassword);
        this.#inputValidation.set('text', this.#typeText);
        this.#inputValidation.set('file', this.#typeFile);
    }

    //TODO: allow hide on ESC

    /**
     * Provides feedback for password fields based on validation rules.
     * Dispatches a 'validation' event with feedback details.
     * @param event - The input event.
     */

    #typePassword(el: HTMLInputElement): string[] {
        const val = el.value;
        let feedback: string[] = [];
        if (!/[A-Z]/.test(val)) feedback.push('missing an uppercase letter');
        if (!/[a-z]/.test(val)) feedback.push('missing an lowercase letter');
        if (!/[0-9]/.test(val)) feedback.push('missing an number');
        if (!/[!@#$%^&*()\-_=+{};:,<.>]/.test(val)) feedback.push('missing a special character');
        if (val.length < 12 || val.length > 64)
            feedback.push(`Password should be 12-64 characters long, is: ${val.length}`);
        return feedback;
    }

    #typeText(el: HTMLInputElement): string[] {
        const val = el.value;
        let feedback: string[] = [];
        if (!/[A-Za-z0-9]/.test(val)) feedback.push('Forbidden character');
        if (val.length < 4 || val.length > 18)
            feedback.push(`Range for pw is 4-18, current length is: ${val.length}`);
        return feedback;
    }

    #typeFile(el: HTMLInputElement): string[] {
        const file = el.files;
        const allowed = ['image/jpeg', 'image/png', 'image/gif'];
        let feedback: string[] = [];
        if (file && file[0]) {
            if (!allowed.includes(file[0].type)) {
                el.setCustomValidity('invalid extension');
                feedback.push(`Invalid extension: ${file[0].type}`);
            } else {
                el.setCustomValidity('');
            }
        }
        return feedback;
    }
    inputFeedback(event: Event) {
        let target: HTMLInputElement | null = null;
        if (event.target instanceof HTMLInputElement) {
            target = event.target as HTMLInputElement;
        }

        if (!target) return;
        const type = target.getAttribute('type');
        if (!type) return;
        const fn = this.#inputValidation.get(type);
        if (!fn) return;
        let feedback = fn(target);
        this.dispatchEvent(new CustomEvent('validation', { detail: { feedback }, bubbles: true }));
    }

    connectedCallback() {
        this.addEventListener('input', this.#inputCallback);
        this.render();
    }

    disconnectedCallback() {
        this.removeEventListener('input', this.#inputCallback);
    }

    render() {
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
        this.#validationCallback = (event: Event) => this.#displayInputFeedback(event);
    }

    /**
     * Sets input field information for label & input configuration.
     */
    set info(data: InputFieldsData) {
        this.#info = data;
    }

    get label() {
        return this.#label;
    }

    /**
     * Displays input feedback messages in the feedback element.
     * @param event - The validation event.
     */
    #displayInputFeedback(event: Event) {
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

        if (ev.detail.feedback.length > 0) {
            this.#inputFeedback.append(list);
            this.dispatchEvent(new CustomEvent('disable-submit', { bubbles: true }));
        }
    }

    //TODO: add disconnected callback
    /**
     * Called when the element is added to the document.
     * Adds validation event listeners and renders the group.
     */
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

    #isRequiredField() {
        if (this.#info.required) this.#input.setAttribute('required', '');
        this.#info.required
            ? (this.#label.content = this.#info.labelContent + ' *')
            : (this.#label.content = this.#info.labelContent);
    }

    #isRange() {
        if (!this.#info.min || !this.#info.max || !this.#info.step) {
            throw new Error('Slider type input needs min, max and step');
        }
        this.#input.min = this.#info.min;
        this.#input.max = this.#info.max;
        this.#input.step = this.#info.step;
    }

    #isUpload() {
        this.#input.classList.add(
            'pl-(24px)',
            'file:absolute',
            'file:top-[5px]',
            'file:left-[4px]',
            'file:w-[5rem]',
            'file:h-[26px]',
        );
        this.#input.setAttribute('accept', 'image/jpeg,image/png,image/gif');
    }

    /**
     * Sets Input attributes based on info.
     * @private
     */
    #setInputAttributes() {
        this.#input.name = this.#info.id;
        this.#input.id = this.#info.id;
        this.#input.placeholder = this.#info.placeholder;
        this.#input.pattern = this.#info.pattern;
        this.#input.type = this.#info.type;
    }

    /**
     * Sets label attributes based on info.
     * @private
     */
    #setLabelAttributes() {
        this.#label.for = this.#info.id;
    }

    render() {
        this.append(this.#label, this.#input, this.#inputFeedback);

        this.className = 'box-border relative w-full';
        this.#inputFeedback.className = 'brdr bg absolute hidden';

        this.#isRequiredField();
        this.#setInputAttributes();
        this.#setLabelAttributes();

        if (this.#info.type === 'range') {
            try {
                this.#isRange();
            } catch (error) {
                console.log(error);
            }
        }

        if (this.#info.type === 'file') this.#isUpload();
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
        this.#validationCallback = (event: Event) => this.#displayInputFeedback(event);
    }

    /**
     * Displays input feedback messages in the feedback element.
     * @param event - The validation event.
     */
    #displayInputFeedback(event: Event) {
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

    #setInputAttributes() {
        if (this.#info.required) this.#input.setAttribute('required', '');
        this.#input.id = this.#info.id;
        this.#input.maxLength = 256;
        this.#input.name = this.#info.id;
        this.#input.placeholder = this.#info.placeholder;
    }

    #setLabelAttributes() {
        this.#label.content = this.#info.labelContent;
        this.#label.for = this.#info.id;
    }

    render() {
        this.append(this.#label, this.#input, this.#inputFeedback);

        this.#setInputAttributes();
        this.#setLabelAttributes();
        this.#inputFeedback.className = 'brdr bg hidden';
        this.#input.className = 'resize-y brdr h-full pad-xs';
        this.className = 'box-border relative';
    }
}

if (!customElements.get('textarea-and-label')) {
    customElements.define('textarea-and-label', TextAreaGroup, { extends: 'div' });
}
