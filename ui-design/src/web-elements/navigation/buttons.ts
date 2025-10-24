import { createIcon } from '../typography/helpers';
import type { buttonData } from '../../types-interfaces';

/**
 * Custom menu button element extending HTMLButtonElement.
 * Updates styles dynamically based on the "disabled" attribute.
 *
 * Observed attribute: "disabled"
 *
 * @property {buttonData} btn - Button configuration data.
 * @property {boolean} animation - Controls animated text rendering.
 */
export class CustomButton extends HTMLButtonElement {
    #btn: buttonData;
    #animated: boolean;

    static get observedAttributes(): string[] {
        return ['disabled'];
    }

    constructor() {
        super();
        this.#btn = { type: 'button', content: null, ariaLabel: '', img: null };
        this.#animated = false;
    }

    /**
     * Sets button metadata.
     * @param {buttonData} src - The new button configuration.
     */
    set btn(src: buttonData) {
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
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;
        if (name === 'disabled') {
            if (this.disabled) {
                this.classList.add('disabled', 'bg');
                this.classList.remove('bg-yellow');
            } else {
                this.classList.remove('disabled', 'bg');
                this.classList.add('bg-yellow');
            }
        }
    }

    /** Called when element is inserted into the DOM. */
    connectedCallback(): void {
        this.render();
    }

    /** Renders simple textual button content. */
    renderTextualBtn(): void {
        this.textContent = this.#btn.content;
    }

    /** Renders animated button text letter-by-letter. */
    renderAnimatedBtn(): void {
        let index: number = 0;
        for (const char of this.#btn.content!) {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = char;
            letterSpan.style.animationDelay = `${index}s`;
            letterSpan.classList.add('f-brown', 'f-bold', 'whitespace-pre');
            this.appendChild(letterSpan);
            index += 0.1;
        }
    }

    /** Renders button icon if image metadata is provided. */
    renderIconBtn(): void {
        if (this.#btn.img) this.appendChild(createIcon(this.#btn.img));
    }

    /** Updates button styles and content according to current state. */
    render(): void {
        this.className =
            'border-box brdr h-[90%] pad-xs input-emphasis min-w-[4rem] outline-hidden overflow-hidden w-full whitespace-nowrap cursor-pointer button';

        if (this.#btn.content && !this.#animated) {
            this.renderTextualBtn();
            this.classList.add(
                'hover:transform',
                'hover:scale-[1.02]',
                'focus-visible:transform',
                'focus-visible:scale-[1.02]',
            );
        } else if (this.#btn.img) {
            this.renderIconBtn();
        } else if (this.#btn.content && this.#animated) {
            this.renderAnimatedBtn();
            this.classList.add('t2', 'button-shadow');
        }

        if (this.disabled) this.classList.add('disabled', 'bg');
        else if (this.#btn.style) {
            this.#btn.style === 'green'
                ? this.classList.add('valid', 'bg-green')
                : this.classList.add('invalid', 'bg-red', 'text-white');
        } else this.classList.add('bg-yellow');

        this.type = this.#btn.type;
        this.ariaLabel = this.#btn.ariaLabel;
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
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
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
    connectedCallback(): void {
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
    render(): void {
        this.className =
            'tab z-2 w-full h-full pad-xs thin brdr overflow-hidden outline-hidden border-box flex justify-center items-center hover:transform-none';

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
    connectedCallback(): void {
        this.render();
    }

    /** Applies grid layout styling to the tab group container. */
    render(): void {
        this.className =
            'tab-button-wrapper w-full h-s box-border grid grid-flow-col auto-cols-fr auto-rows-[1fr] justify-items-center';
    }
}

if (!customElements.get('tab-button-wrapper')) {
    customElements.define('tab-button-wrapper', TabButtonWrapper, { extends: 'div' });
}
