export class Popup extends HTMLDialogElement {
	#innerComponents: Map<string, HTMLElement>;
	constructor() {
		super();
		this.#innerComponents = new Map<string, HTMLElement>();
		this.id = 'popup';
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.className =
			'box-border absolute top-0 left-0 w-full h-full max-h-full max-w-full grid grid-auto-rows-auto \
			place-content-center layout-col gap-s bg-overlay';
	}

	/**
	 * Getter for this.#innerComponents.
	 * @returns `Map<string, HTMLElement>`
	 */
	get components(): Map<string, HTMLElement> {
		return this.#innerComponents;
	}
	/**
	 * Allows to append inner elements to the layout object, caching them as they we go.
	 * Behaves like a variadic function in C.
	 *
	 * @param el - rest parameter behaving like an array but allowing the parameters to be passed one after the other.
	 * @example page.appendAndCache(header, userProfile, ..., footer);
	 */
	appendAndCache(...el: HTMLElement[]) {
		el.forEach((component) => {
			console.log(el);
			component.classList.add('z-1');
			this.append(component);
			this.#innerComponents.set(component.id, component);
		});
	}
}

if (!customElements.get('custom-popup')) {
	customElements.define('custom-popup', Popup, { extends: 'dialog' });
}
