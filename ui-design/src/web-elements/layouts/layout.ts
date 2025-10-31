export class Layout extends HTMLDivElement {
	#innerComponents: Map <string, HTMLElement>;

	constructor() {
		super();
		this.#innerComponents = new Map<string, HTMLElement>;
		this.className = 'box-border page-w grid place-items-center'
	}

}