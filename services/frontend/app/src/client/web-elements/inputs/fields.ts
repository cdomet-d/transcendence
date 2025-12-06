import type { InputFieldsData } from '../types-interfaces.js';
import { Checkbox } from './buttons.js';
import { createCheckbox } from './helpers.js';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

//TODO: feedback on username
//TODO: err message on required field empty

/**
 * Custom input element.
 * Extends native HTMLInputElement.
 */
export class CustomInput extends HTMLInputElement {
	#inputCallback: (event: Event) => void;
	#inputValidation: Map<string, (el: HTMLInputElement) => string[]>;

	/* -------------------------------------------------------------------------- */
	/*                                   Default                                  */
	/* -------------------------------------------------------------------------- */
	constructor() {
		super();
		this.#inputCallback = (event) => this.feedback(event);
		this.#inputValidation = new Map<string, (el: HTMLInputElement) => string[]>();

		this.#inputValidation.set('password', this.#typePassword);
		this.#inputValidation.set('text', this.#typeText);
		this.#inputValidation.set('file', this.#typeFile);
	}

	connectedCallback() {
		this.addEventListener('input', this.#inputCallback);
		this.render();
	}

	disconnectedCallback() {
		this.removeEventListener('input', this.#inputCallback);
	}

	render() {
		this.autocomplete = 'off';
		this.className = 'brdr w-full';
	}

	/* -------------------------------------------------------------------------- */
	/*                                 Validation                                 */
	/* -------------------------------------------------------------------------- */

	//TODO: allow hide on ESC

	/**
	 * Provides feedback for password fields based on validation rules.
	 * Dispatches a 'validation' event with feedback details.
	 * @param event - The input event.
	 */

    //TODO language
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
		let min: number;

		el.id === 'searchbar' ? (min = 0) : (min = 4);
		const val = el.value;
		let feedback: string[] = [];
		if (!/[A-Za-z0-9]/.test(val)) feedback.push('Forbidden character');
		if (val.length < min || val.length > 18)
			feedback.push(
				`Username should be ${min.toString()}-18 character long, is: ${val.length}`,
			);
		return feedback;
	}

	// TODO: test large file
	#typeFile(el: HTMLInputElement): string[] {
		let feedback: string[] = [];
		const file = el.files;

		if (!file || !file[0]) return feedback;
		const allowed = ['image/jpeg', 'image/png', 'image/gif'];

		if (file[0].size >= MAX_SIZE) {
			el.setCustomValidity('too large');
			feedback.push(`That file is too heavy: max is 2MB!`);
		} else if (!allowed.includes(file[0].type)) {
			el.setCustomValidity('invalid extension');
			feedback.push(`Invalid extension: ${file[0].type}`);
		} else {
			el.setCustomValidity('');
		}
		return feedback;
	}

	feedback(event: Event) {
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

	isForCheckbox() {
		this.className = 'min-w-fit w-[10%] inline-flex';
	}

	render() {
		this.className = 'min-w-fit w-[10%] absolute left-[0px] -top-[25px]';
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
	#feedback: HTMLDivElement;
	#info: InputFieldsData;
	#input: CustomInput | Checkbox;
	#label: InputLabel;
	#renderFeedback: (event: Event) => void;
	#hide: () => void;
	#unhide: () => void;

	/* -------------------------------------------------------------------------- */
	/*                                   Default                                  */
	/* -------------------------------------------------------------------------- */

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
		this.#feedback = document.createElement('div');
		this.#renderFeedback = this.#renderFeedbackImplementation.bind(this);
		this.#hide = this.#hideImplementation.bind(this);
		this.#unhide = this.#unhideImplementation.bind(this);
	}

	/**
	 * Called when the element is added to the document.
	 * Adds validation Event listeners and renders the group.
	 */
	connectedCallback() {
		this.addEventListener('validation', this.#renderFeedback);
		this.#input.addEventListener('blur', this.#hide);
		this.#input.addEventListener('focus', this.#unhide);
		this.render();
	}

	disconnectedCallback() {
		this.removeEventListener('validation', this.#renderFeedback);
		this.#input.removeEventListener('blur', this.#hide);
		this.#input.removeEventListener('focus', this.#unhide);
		this.render();
	}

	/* -------------------------------------------------------------------------- */
	/*                                  Rendering                                 */
	/* -------------------------------------------------------------------------- */
	#isRequiredField() {
		if (this.#info.required) this.#input.setAttribute('required', '');
		this.#info.required
			? (this.#label.content = this.#info.labelContent + ' *')
			: (this.#label.content = this.#info.labelContent);
	}

	#isRange() {
		if (!(this.#input instanceof CustomInput)) return;
		if (!this.#info.min || !this.#info.max || !this.#info.step) {
			throw new Error('Slider type input needs min, max and step');
		}
		this.#input.min = this.#info.min;
		this.#input.max = this.#info.max;
		this.#input.step = this.#info.step;
		this.#input.value = '0';
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

	#appendAndStyle() {
		if (this.#info.type === 'checkbox') {
			this.#input = createCheckbox(this.#info.id, this.#info.id) as Checkbox;
			this.append(this.#input, this.#label);
			this.#label.isForCheckbox();
			if (this.#info.type === 'checkbox') this.classList.add('flex', 'gap-s');
		} else {
			this.append(this.#label, this.#input, this.#feedback);
			this.#feedback.className = 'brdr bg absolute hidden w-full';
		}
	}

	/**
	 * Sets Input attributes based on info.
	 * @private
	 */
	#setInputAttributes() {
		if (!(this.#input instanceof CustomInput)) return;
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
		this.className = 'box-border relative w-full';
		this.#appendAndStyle();

		this.#isRequiredField();
		this.#setInputAttributes();
		this.#setLabelAttributes();

		if (this.#info.type === 'range') {
			try {
				this.#isRange();
			} catch (error) {
				console.error(error);
			}
		}

		if (this.#info.type === 'file') this.#isUpload();
	}

	/* -------------------------------------------------------------------------- */
	/*                                   Setters                                  */
	/* -------------------------------------------------------------------------- */
	/**
	 * Sets input field information for label & input configuration.
	 */
	set info(data: InputFieldsData) {
		this.#info = data;
	}

	/* -------------------------------------------------------------------------- */
	/*                                   Getter                                   */
	/* -------------------------------------------------------------------------- */

	get label() {
		return this.#label;
	}

	/* -------------------------------------------------------------------------- */
	/*                               Event Listeners                              */
	/* -------------------------------------------------------------------------- */
	#hideImplementation() {
		this.#feedback.classList.add('hidden');
		this.classList.remove('z-5');
	}

	#unhideImplementation() {
		if (this.#feedback.firstChild) {
			this.#feedback.classList.remove('hidden');
			this.classList.add('z-5');
		}
	}

	/**
	 * Displays input feedback messages in the feedback element.
	 * @param event - The validation event.
	 */
	#renderFeedbackImplementation(event: Event) {
		const ev = event as CustomEvent;

		if (ev.detail.feedback.length > 0) {
			this.#feedback.classList.remove('hidden');
			this.classList.add('z-5');
		} else {
			this.#feedback.classList.add('hidden');
			this.classList.remove('z-5');
			return;
		}
		if (this.#feedback.firstChild) this.#feedback.removeChild(this.#feedback.firstChild);

		const list = document.createElement('ul');
		list.className = 'pad-xs list-inside';
		for (let i: number = 0; i < ev.detail.feedback.length; i++) {
			const ul = document.createElement('li');
			ul.innerText = ev.detail.feedback[i];
			ul.className = 'list-disc';
			list.append(ul);
		}

		if (ev.detail.feedback.length > 0) {
			this.#feedback.append(list);
			this.dispatchEvent(new CustomEvent('disable-submit', { bubbles: true }));
		}
	}
}
if (!customElements.get('input-and-label')) {
	customElements.define('input-and-label', InputGroup, { extends: 'div' });
}
export class TextAreaGroup extends HTMLDivElement {
	#input: HTMLTextAreaElement;
	#label: InputLabel;
	#info: InputFieldsData;
	#feedback: HTMLDivElement;
	#renderFeedback: (event: Event) => void;

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
		this.#feedback = document.createElement('div');
		this.#renderFeedback = (event: Event) => this.#renderFeedbackImplementation(event);
	}

	/**
	 * Displays input feedback messages in the feedback element.
	 * @param event - The validation event.
	 */
	#renderFeedbackImplementation(event: Event) {
		const ev = event as CustomEvent;
		if (ev.detail.feedback.length > 0) this.#feedback.classList.remove('hidden');
		else this.#feedback.classList.add('hidden');
		if (this.#feedback.firstChild) this.#feedback.removeChild(this.#feedback.firstChild);
		const list = document.createElement('ul');
		list.className = 'pad-xs list-inside';
		for (let i: number = 0; i < ev.detail.feedback.length; i++) {
			const ul = document.createElement('li');
			ul.innerText = ev.detail.feedback[i];
			ul.className = 'list-disc';
			list.append(ul);
		}
		this.#feedback.append(list);
	}

	connectedCallback() {
		this.addEventListener('validation', this.#renderFeedback);
		this.#input.addEventListener('blur', () => {
			this.#feedback.classList.add('hidden');
		});
		this.#input.addEventListener('focus', () => {
			if (this.#feedback.firstChild) this.#feedback.classList.remove('hidden');
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
		this.append(this.#label, this.#input, this.#feedback);

		this.#setInputAttributes();
		this.#setLabelAttributes();
		this.#feedback.className = 'brdr bg hidden absolute w-full w-5';
		this.#input.className = 'resize-none brdr h-full pad-xs';
		this.className = 'box-border relative z-4';
	}
}

if (!customElements.get('textarea-and-label')) {
	customElements.define('textarea-and-label', TextAreaGroup, { extends: 'div' });
}
