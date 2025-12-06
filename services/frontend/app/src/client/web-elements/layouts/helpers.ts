import { Layout } from './layout.js';

export function createLayout() {
	const el = document.createElement('div', { is: 'layout' }) as Layout;
	return el;
}
