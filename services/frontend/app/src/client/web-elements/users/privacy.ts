export class Privacy extends HTMLDivElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.id = 'privacy';
		this.className = 'bg content-h w-full brdr overflow-y-auto overflow-x-hidden justify-start';
		this.innerText = "Privacy Policy Content Here"; 
	}
}

if (!customElements.get('privacy-page')) {
	customElements.define('privacy-page', Privacy, { extends: 'div' });
}

export function createPrivacy(): Privacy {
	const el = document.createElement('div', { is: 'privacy-page' }) as Privacy;
	return el;
}