import { createIcon } from '../typography/helpers';
import type { BtnMetadata } from '../../types-interfaces';

/**
 * Custom menu button element extending HTMLButtonElement.
 * Updates styles dynamically based on the "disabled" attribute.
 *
 * Observed attribute: "disabled"
 *
 * @property content - Setter to update the button's text content.
 *
 * @example
 * const btn = document.createElement("button", { is: "menu-button" }) as menuBtn;
 * btn.content = "Click me";
 * btn.disabled = true;
 * document.body.appendChild(btn);
 */
export class menuBtn extends HTMLButtonElement {
    #btnData: BtnMetadata;

    static get observedAttributes() {
        return ['disabled'];
    }
    constructor() {
        super();

        this.#btnData = { role: '', content: null, ariaLabel: '', img: null };
    }

    set btnData(src: BtnMetadata) {
        this.#btnData = src;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        if (name === 'disabled')
            if (this.disabled) {
                this.classList.add('disabled', 'clear-bg');
                this.classList.remove('yellow-bg');
            } else {
                this.classList.remove('disabled', 'clear-bg');
                this.classList.add('yellow-bg');
            }
    }
    connectedCallback() {
        this.render();
    }

    renderTextualBtn() {
        this.textContent = this.#btnData.content;
    }

    renderIconBtn() {
        if (this.#btnData.img) this.appendChild(createIcon(this.#btnData.img));
    }

    render() {
        this.className =
            'border-box brdr flex h-[90%] input-emphasis items-center justify-center min-w-[4rem] outline-hidden overflow-hidden w-[100%] whitespace-nowrap';
        if (this.disabled) {
            this.classList.add('disabled', 'clear-bg');
        } else {
            this.classList.add('yellow-bg');
        }
        this.role = this.#btnData.role;
        this.ariaLabel = this.#btnData.ariaLabel;
        if (this.#btnData.content) this.renderTextualBtn();
        else this.renderIconBtn();
    }
}
customElements.define('menu-button', menuBtn, { extends: 'button' });

/**
 * Custom tab button element extending HTMLButtonElement.
 * Toggles styling based on the presence of the "selected" attribute.
 *
 * Observed attribute: "selected"
 *
 * @property content - Setter to update the button's text content.
 *
 * @example
 * const tab = document.createElement("button", { is: "tab" }) as tab;
 * tab.content = "Home";
 * tab.setAttribute("selected", "");
 * document.body.appendChild(tab);
 */
export class tabBtn extends HTMLButtonElement {
    static get observedAttributes() {
        return ['selected'];
    }
    constructor() {
        super();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        if (name === 'selected')
            if (this.hasAttribute('selected')) {
                this.classList.remove('yellow-bg', 'brdr', 'z-2');
                this.classList.add('z-1');
            } else {
                this.classList.remove('z-1');
                this.classList.add('yellow-bg', 'brdr', 'z-2');
            }
    }
    connectedCallback() {
        this.render();
    }

    set content(val: string) {
        this.textContent = val;
    }

    render() {
        this.className =
            'tab z-2 w-[100%] h-[100%] thin brdr overflow-hidden outline-hidden border-box flex justify-center items-center hover:transform-none';
        if (this.hasAttribute('selected')) {
            this.classList.remove('yellow-bg', 'brdr', 'z-2');
            this.classList.add('z-1');
        } else {
            this.classList.remove('z-1');
            this.classList.add('yellow-bg', 'brdr', 'z-2');
        }
    }
}

customElements.define('tab-button', tabBtn, { extends: 'button' });

/**
 * Custom tab group extending HTMLDivElement.
 * Manages a collection of tab buttons.
 *
 * @example
 * const tabs: Tab[] = [
 *   { data: "home", content: "Home" },
 *   { data: "profile", content: "Profile" },
 * ];
 * const tabGroup = document.createElement("div", { is: "tab-group" }) as tabGroup;
 * document.body.appendChild(tabGroup);
 */
export class tabGroup extends HTMLDivElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className =
            'tab-group w-[100%] h-s box-border grid grid-flow-col auto-cols-fr auto-rows-[1fr] justify-items-center';
    }
}

customElements.define('tab-group', tabGroup, { extends: 'div' });
