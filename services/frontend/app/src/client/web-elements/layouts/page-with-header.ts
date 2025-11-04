import { Layout } from './layout.js';

export class pageWithHeader extends Layout {
	constructor() {
		super();
		this.id = 'page-w-header';
	}

	override clearAll(): void {
		super.components.forEach((el) => {
			if (el.id !== 'header') el.remove();
		})
		for (const key in super.components) {
			if (key !== 'header') super.components.delete(key);
		}
	}

	render() {
		super.render();
		this.classList.add('grid', 'place-content-center', 'v-gap-l');
	}
}

if (!customElements.get('page-w-header')) {
	customElements.define('page-w-header', pageWithHeader, { extends: 'div' });
}
