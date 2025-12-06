export class Listbox extends HTMLUListElement {
	#listboxOptions: HTMLLIElement[];
	#currentFocus: number;
	#focusHandler: (ev: FocusEvent) => void;
	#keynavHandler: (ev: KeyboardEvent) => void;
	#mouseNavHandler: (ev: MouseEvent) => void;

	constructor() {
		super();
		this.#keynavHandler = this.keyboardNavHandler.bind(this);
		this.#mouseNavHandler = this.mouseNavHandler.bind(this);
		this.#focusHandler = this.#handleFocusOut.bind(this);
		this.role = 'listbox';
		this.setAttribute('hidden', '');
		this.className = 'hidden';
		this.#listboxOptions = Array.from(this.children) as HTMLLIElement[];
	}

	connectedCallback() {
		this.addEventListener('keydown', this.#keynavHandler);
		this.addEventListener('click', this.#mouseNavHandler);
		this.addEventListener('focusout', this.#focusHandler);
	}

	disconnectedCallback() {
		this.removeEventListener('keydown', this.#keynavHandler);
		this.removeEventListener('click', this.#mouseNavHandler);
		this.removeEventListener('focusout', this.#focusHandler);
	}

	#selectOption(t: HTMLElement) {
		t.ariaSelected = 'true';
		t.setAttribute('selected', '');
	}

	#clearSelection(li: HTMLLIElement) {
		li.removeAttribute('selected');
		li.ariaSelected = 'false';
	}

	/** Reveals the listbox popup and sets the focus back on either the first element or the current selection */
	expand(isKeyboard: boolean) {
		this.classList.add('z-5');
		this.classList.remove('hidden');
		this.removeAttribute('hidden');
		if (this.#currentFocus === -1 && isKeyboard) this.#moveFocus(1);
		else if (this.#currentFocus !== -1) {
			const focusedOption = this.#listboxOptions[this.#currentFocus];
			if (focusedOption) focusedOption.focus();
		}
	}

	//TODO: make the toggle focus only on keyboard navigation.
	/** Hides the listbox popup and sets the focus back on toggle */
	collapse() {
		if (this.hasAttribute('hidden')) return;
		else {
			this.classList.add('hidden');
			this.ariaExpanded = 'false';
			this.setAttribute('hidden', '');
		}
	}

	/**
	 * Targets dropdown menu and updates the active element representing the user's choice.
	 * It sets the attribute `selected` on the user's choice, then updates the toggle's content with the selected option.
	 * @param {HTMLElement} [target] - optionnal. Allows `#updateSelection()` to be called both by the `'click'` handler, which passes a target, and by the `'keydown'` handler, that updates the internal property `this.#currentFocus`
	 */
	updateSelection(target: HTMLElement) {
		if (target.tagName === 'LI') {
			this.#listboxOptions.forEach((li) => this.#clearSelection(li));
			this.#selectOption(target);
			this.collapse();
		}
	}

	/**
	 * Used by the `'keydown'` handler to calculate where the user is in the menu's option, remaining within the bounds of the options.
	 * @param {number} delta - the incrementing step; it's worth `-1` on `ArrowUp` and `1` on `ArrowDown`
	 */
	#moveFocus(delta: number) {
		this.#currentFocus = (this.#currentFocus + delta + this.#listboxOptions.length) % this.#listboxOptions.length;
		const focusedOption = this.#listboxOptions[this.#currentFocus];
		if (focusedOption) focusedOption.focus();
	}

	/**
	 * Collapses the options when the user tabs or clicks away from the dropdown and it looses focus.
	 * @param ev - The Focus Event
	 */
	#handleFocusOut(ev: FocusEvent) {
		const relTarget = ev.relatedTarget as HTMLElement | null;
		if (!relTarget || !this.contains(relTarget)) {
			this.collapse();
		}
	}

	/**
	 * Handles keyboard navigation.
	 * @param {KeyboardEvent} ev - the event send by `addEventListener`
	 */
	keyboardNavHandler(ev: KeyboardEvent) {
		const actions: { [key: string]: () => void } = {
			ArrowDown: () => this.#moveFocus(1),
			ArrowUp: () => this.#moveFocus(-1),
		};

		if (actions[ev.key]) {
			ev.preventDefault();
			actions[ev.key]();
		}
	}

	/**
	 * Handles mouse navigation.
	 * @param {MouseEvent} ev - the event send by `addEventListener`
	 */
	mouseNavHandler(ev: MouseEvent) {
		const target = ev.target as HTMLButtonElement;
		if (target.tagName === 'BUTTON') {
			this.hasAttribute('hidden') ? this.expand(false) : this.collapse();
		} else this.updateSelection(target);
	}
}

if (!customElements.get('list-box')) {
	customElements.define('list-box', Listbox, { extends: 'HTMLUListElement' });
}
