export class RadioButton extends HTMLDivElement {
	#input: HTMLInputElement;
	#check: HTMLSpanElement;
	#moveFocusHandler: () => void;
	#toggleInputHandler: (e: KeyboardEvent) => void;

	constructor() {
		super();
		this.#input = document.createElement('input');
		this.#check = document.createElement('span');
		this.#moveFocusHandler = this.#moveFocusImplementation.bind(this);
		this.#toggleInputHandler = this.#toggleInputImplementation.bind(this);

		// Forward keyboard Space & Enter events to toggle the radio input
		this.addEventListener('keydown', (e) => {
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				this.#input.click();
			}
		});
	}

	set inputName(val: string) {
		this.#input.name = val;
	}

	set inputId(val: string) {
		this.#input.id = val;
	}

	#moveFocusImplementation() {
		this.#input.focus();
	}

	#toggleInputImplementation(e: KeyboardEvent) {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			this.#input.click();
		}
	}

	connectedCallback() {
		this.render();

		this.setAttribute('tabindex', '0');
		this.addEventListener('keydown', this.#toggleInputHandler);
		this.addEventListener('focus', this.#moveFocusHandler);
		this.addEventListener('click', this.#moveFocusHandler);
	}

	disconnectedCallback() {
		this.removeEventListener('keydown', this.#toggleInputHandler);
		this.removeEventListener('focus', this.#moveFocusHandler);
		this.removeEventListener('click', this.#moveFocusHandler);
	}
	render() {
		this.append(this.#input, this.#check);
		this.#input.type = 'radio';
		this.#input.className = 'peer z-2 absolute top-[0] left-[0] cursor-pointer';
		this.#check.className =
			'thin brdr z-1 bg-orange absolute top-[0] left-[0] cursor-pointer w-[18px] h-full peer-checked:absolute peer-checked:left-1/2 box-border';
		this.className = 'box-border relative block border-none w-[36px] h-[24px] brdr bg';
	}
}

if (!customElements.get('radio-button')) {
	customElements.define('radio-button', RadioButton, { extends: 'div' });
}

export class Checkbox extends HTMLDivElement {
	#input: HTMLInputElement;
	#check: HTMLSpanElement;
	#moveFocusHandler: () => void;
	#toggleInputHandler: (e: KeyboardEvent) => void;

	constructor() {
		super();
		this.#input = document.createElement('input');
		this.#check = document.createElement('span');
		this.#moveFocusHandler = this.#moveFocusImplementation.bind(this);
		this.#toggleInputHandler = this.#toggleInputImplementation.bind(this);
	}

	set inputName(val: string) {
		this.#input.name = val;
	}

	set inputId(val: string) {
		this.#input.id = val;
	}

	#moveFocusImplementation() {
		this.#input.focus();
	}

	#toggleInputImplementation(e: KeyboardEvent) {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			this.#input.click();
		}
	}

	connectedCallback() {
		this.render();

		this.setAttribute('tabindex', '0');
		this.addEventListener('keydown', this.#toggleInputHandler);
		this.addEventListener('focus', this.#moveFocusHandler);
		this.addEventListener('click', this.#moveFocusHandler);
	}

	disconnectedCallback() {
		this.removeEventListener('keydown', this.#toggleInputHandler);
		this.removeEventListener('focus', this.#moveFocusHandler);
		this.removeEventListener('click', this.#moveFocusHandler);
	}

	render() {
		this.append(this.#input, this.#check);
		this.#input.type = 'checkbox';
		this.#input.className = 'peer m-0 z-2 cursor-pointer absolute top-[0] left-[0]';
		this.#check.className =
			'peer-checked:block z-1 hidden absolute top-[4px] left-[4px] cursor-pointer w-[16px] h-[16px] thin brdr bg-orange';
		this.className = 'w-[24px] h-[24px] box-border relative block border-none brdr bg-yellow';
	}
}

if (!customElements.get('checkbox-input')) {
	customElements.define('checkbox-input', Checkbox, { extends: 'div' });
}
