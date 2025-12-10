import type { Feedback } from './web-elements/types-interfaces';
import { router } from './main';
import { DOMReady } from './router';

export class UIFeedback extends HTMLSpanElement {
	constructor() {
		super();
	}

	set content(str: string) {
		this.innerText = str;
		this.render();
	}

	set type(type: Feedback) {
		type === 'error' ? this.classList.add('bg-red', 'invalid') : this.classList.add('bg-green', 'valid');
	}

	connectedCallback() {
		this.className = 'absolute bottom-0 w-full h-m pad-xs brdr';
		this.render();
	}

	render() {}
}

if (!customElements.get('ui-feedback')) {
	customElements.define('ui-feedback', UIFeedback, { extends: 'span' });
}

export function errorMessageFromException(error: unknown): string {
	let mess = 'Something went wrong';
	if (error && error instanceof Error) mess = error.message;
	return mess;
}

export async function exceptionFromResponse(response: Response): Promise<Error> {
	const errorData = await response.json();
	return new Error(`Error: ${response.status}: ${errorData.message}`);
}

export function createVisualFeedback(message: string, type?: Feedback) {
	const err = document.createElement('span', { is: 'ui-feedback' }) as UIFeedback;
	document.body.layoutInstance?.appendAndCache(err);
	err.content = message;
	!type ? (err.type = 'error') : (err.type = type);
}

export async function redirectOnError(route: string, message: string) {
	router.loadRoute(route, true);
	await DOMReady();
	createVisualFeedback(message);
}
