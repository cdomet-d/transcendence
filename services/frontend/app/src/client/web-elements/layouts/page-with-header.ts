import { PageHeader } from '../navigation/header.js';
import { Layout } from './layout.js';

export class pageWithHeader extends Layout {
    #header: PageHeader;

    constructor() {
        super();
        this.#header = document.createElement('header', { is: 'page-header' }) as PageHeader;
        this.append(this.#header);
		this.id = 'page-w-header';
    }

    render() {
        super.render();
        this.classList.add('grid', 'items-stretch', 'v-gap-l');
    }
}

if (!customElements.get('page-w-header')) {
    customElements.define('page-w-header', pageWithHeader, { extends: 'div' });
}
