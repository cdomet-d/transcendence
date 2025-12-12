import { createIcon } from '../typography/helpers.js';
import type { ButtonData } from '../types-interfaces.js';

/**
 * Custom menu button element extending HTMLButtonElement.
 * Updates styles dynamically based on the "disabled" attribute.
 *
 * Observed attribute: "disabled"
 *
 * @property {ButtonData} btn - Button configuration data.
 * @property {boolean} animation - Controls animated text rendering.
 */

export class CustomButton extends HTMLButtonElement {
	#btn: ButtonData;
	#animated: boolean;

	static get observedAttributes(): string[] {
		return ['disabled'];
	}

	constructor() {
		super();
		this.#btn = { id: '', type: 'button', content: null, ariaLabel: '', img: null };
		this.#animated = false;
	}

	/**
	 * Sets button metadata.
	 * @param {ButtonData} src - The new button configuration.
	 */
	set btn(src: ButtonData) {
		this.#btn = src;
	}

	/**
	 * Enables or disables animated text rendering.
	 * @param {boolean} b - Animation toggle flag.
	 */
	set animation(b: boolean) {
		this.#animated = b;
	}

	/**
	 * Handles attribute changes for observed attributes.
	 * @param {string} name - The attribute name.
	 * @param {string} oldValue - The previous value of the attribute.
	 * @param {string} newValue - The new value of the attribute.
	 */
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) return;
		if (name === 'disabled') {
			if (this.disabled) {
				this.classList.add('disabled', 'bg');
				this.classList.remove('bg-yellow', 'input-emphasis');
			} else {
				this.classList.remove('disabled', 'bg');
				this.classList.add('bg-yellow', 'input-emphasis');
			}
		}
	}

	/** Called when element is inserted into the DOM. */
	connectedCallback() {
		this.render();
	}

	/** Renders simple textual button content. */
	renderTextualBtn() {
		this.textContent = this.#btn.content;
	}

	/** Renders animated button text letter-by-letter. */
	renderAnimatedBtn() {
		let index: number = 0;
		for (const char of this.#btn.content!) {
			const letterSpan = document.createElement('span');
			letterSpan.setAttribute('aria-hidden', '');
			letterSpan.textContent = char;
			letterSpan.style.animationDelay = `${index}s`;
			letterSpan.classList.add('f-brown', 'f-bold', 'whitepre');
			this.append(letterSpan);
			index += 0.1;
		}
		this.classList.add('t1', 'button-shadow');
	}

	/** Renders button icon if image metadata is provided. */
	renderIconBtn() {
		if (this.#btn.img) {
			const icon = createIcon(this.#btn.img);
			icon.setAttribute('aria-hidden', '');
			this.append(icon);
		}
	}

	#dynamicStyling() {
		if (this.disabled) this.classList.add('disabled', 'bg');
		else if (this.#btn.style) {
			this.#btn.style === 'green'
				? this.classList.add('valid', 'bg-green')
				: this.classList.add('invalid', 'bg-red', 'text-white');
		} else this.classList.add('bg-yellow', 'button');
	}

	/** Updates button styles and content according to current state. */
	render() {
		this.className =
			'box-border w-full brdr pad-xs input-emphasis outline-hidden \
			overflow-hidden whitenowrap';

		if (this.#btn.content && !this.#animated) {
			this.renderTextualBtn();
		} else if (this.#btn.content && this.#animated) {
			this.renderAnimatedBtn();
		} else if (this.#btn.img) {
			this.renderIconBtn();
		}
		this.#dynamicStyling();
		if (this.#btn.action) this.dataset.action = this.#btn.action;
		this.type = this.#btn.type;
		this.ariaLabel = this.#btn.ariaLabel;
		this.id = this.#btn.id;
	}
}

if (!customElements.get('custom-button')) {
	customElements.define('custom-button', CustomButton, { extends: 'button' });
}

/**
 * Custom tab button element extending HTMLButtonElement.
 * Toggles styling based on the presence of the "selected" attribute.
 *
 * Observed attribute: "selected"
 *
 * @property {string} content - Text content of the tab button.
 */
export class TabButton extends HTMLButtonElement {
	static get observedAttributes(): string[] {
		return ['selected'];
	}

	constructor() {
		super();
	}

	/**
	 * Handles attribute changes for observed attributes.
	 * @param {string} name - The attribute name.
	 * @param {string} oldValue - The previous value of the attribute.
	 * @param {string} newValue - The new value of the attribute.
	 */
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) return;
		if (name === 'selected') {
			if (this.hasAttribute('selected')) {
				this.classList.remove('bg-yellow', 'brdr', 'z-2');
				this.classList.add('z-1');
			} else {
				this.classList.remove('z-1');
				this.classList.add('bg-yellow', 'brdr', 'z-2');
			}
		}
	}

	/** Called when element is inserted into the DOM. */
	connectedCallback() {
		this.render();
	}

	/**
	 * Sets the displayed text content.
	 * @param {string} val - The text content to display.
	 */
	set content(val: string) {
		this.textContent = val;
	}

	/** Updates styles depending on selection state. */
	render() {
		this.className =
			'tab z-2 h-full w-full pad-xs thin brdr overflow-hidden outline-hidden box-border flex justify-center items-center hover:transform-none';

		if (this.hasAttribute('selected')) {
			this.classList.remove('bg-yellow', 'brdr', 'z-2');
			this.classList.add('z-1');
		} else {
			this.classList.remove('z-1');
			this.classList.add('bg-yellow', 'brdr', 'z-2');
		}
	}
}

if (!customElements.get('tab-button')) {
	customElements.define('tab-button', TabButton, { extends: 'button' });
}

/**
 * Custom tab group container element extending HTMLDivElement.
 * Manages and styles a group of tab buttons.
 */
export class TabButtonWrapper extends HTMLDivElement {
	constructor() {
		super();
	}

	/** Called when element is inserted into the DOM. */
	connectedCallback() {
		this.render();
	}

	/** Applies grid layout styling to the tab group container. */
	render() {
		this.className =
			'box-border grid grid-flow-col auto-cols-fr auto-rows-[1fr] justify-items-center';
	}
}

if (!customElements.get('tab-button-wrapper')) {
	customElements.define('tab-button-wrapper', TabButtonWrapper, { extends: 'div' });
}
