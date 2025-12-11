export class Listbox extends HTMLUListElement {
	#options: HTMLLIElement[];
	#currentFocus: number;
	#keynavHandler: (ev: KeyboardEvent) => void;
	#mouseNavHandler: (ev: MouseEvent) => void;

	constructor() {
		super();
		this.#keynavHandler = this.keyboardNavHandler.bind(this);
		this.#mouseNavHandler = this.mouseNavHandler.bind(this);
		this.id = 'listbox';
		this.role = 'listbox';
		this.#currentFocus = -1;
		this.setAttribute('hidden', '');
		this.className = 'hidden';
		this.#options = [];

		this.ariaLabel = 'Select an option';
		this.ariaMultiSelectable = 'false';
	}

	get options() {
		return this.#options;
	}
	/**
	 * Set the internal option list for keyboard navigation.
	 */
	arrayFromChildren() {
		this.#options = Array.from(this.children) as HTMLLIElement[];
		this.#options.forEach((option) => {
			option.role = 'option';
			option.tabIndex = -1;
			option.ariaSelected = 'false';
		});
	}

	connectedCallback() {
		this.addEventListener('keydown', this.#keynavHandler);
		this.addEventListener('click', this.#mouseNavHandler);
	}

	disconnectedCallback() {
		this.removeEventListener('keydown', this.#keynavHandler);
		this.removeEventListener('click', this.#mouseNavHandler);
	}

	#selectOption(t: HTMLElement) {
		t.ariaSelected = 'true';
		t.setAttribute('selected', '');
	}

	#clearSelection(li: HTMLLIElement) {
		li.removeAttribute('selected');
		li.ariaSelected = 'false';
	}

	/** Reveals the listbox popup and sets the focus back on either
	 * the first element or the current selection */
	expand() {
		console.log('expanded')
		this.classList.remove('hidden');
		this.removeAttribute('hidden');
		this.setAttribute('aria-expanded', 'true');
		console.log(this.#currentFocus)
		if (this.#currentFocus === -1) this.#moveFocus(1);
		else if (this.#currentFocus !== -1) {
			const focusedOption = this.#options[this.#currentFocus];
			if (focusedOption) focusedOption.focus();
		}
	}

	collapse() {
		this.classList.add('hidden');
		this.setAttribute('hidden', '');
	}

	/**
	 * Targets dropdown menu and updates the active element representing the user's choice.
	 * It sets the attribute `selected` on the user's choice, then updates the toggle's content with the selected option.
	 * @param {HTMLElement} [target] - optionnal. Allows `#updateSelection()` to be called both by the `'click'` handler, which passes a target, and by the `'keydown'` handler, that updates the internal property `this.#currentFocus`
	 */
	updateSelection(target: HTMLElement) {
		if (target.tagName === 'LI') {
			this.#options.forEach((li) => this.#clearSelection(li));
			this.#selectOption(target);
			this.collapse();
		}
	}

	/**
	 * Used by the `'keydown'` handler to calculate where the user is in the menu's option, remaining within the bounds of the options.
	 * @param {number} delta - the incrementing step; it's worth `-1` on `ArrowUp` and `1` on `ArrowDown`
	 */
	#moveFocus(delta: number) {
		this.#currentFocus = (this.#currentFocus + delta + this.#options.length) % this.#options.length;
		const focusedOption = this.#options[this.#currentFocus];
		if (focusedOption) {
			focusedOption.focus();
		}
		console.log(focusedOption.firstChild)
	}

	/**
	 * Handles keyboard navigation.
	 * @param {KeyboardEvent} ev - the event send by `addEventListener`
	 */
	keyboardNavHandler(ev: KeyboardEvent) {
		const target = ev.target as HTMLElement;
		const actions: { [key: string]: () => void } = {
			Enter: () => this.updateSelection(target),
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
		this.updateSelection(target);
	}
}

if (!customElements.get('list-box')) {
	customElements.define('list-box', Listbox, { extends: 'ul' });
}
