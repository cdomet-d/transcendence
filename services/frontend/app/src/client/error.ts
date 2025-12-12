import type { Feedback } from './web-elements/types-interfaces';
import { router } from './main';
import { DOMReady } from './router';
import { currentDictionary } from './web-elements/forms/language';

//TODO : map avec le code et current dictionnary
// not allow to be here on redirect 
// massage pour lobby "go join a lobby"

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

	render() { }
}

if (!customElements.get('ui-feedback')) {
	customElements.define('ui-feedback', UIFeedback, { extends: 'span' });
}

export function errorMessageFromException(error: unknown): string {
	let mess = currentDictionary.error.something_wrong;

	if (error && error instanceof Error) {
		mess = error.message;
		if (error.cause) {
			mess = `${error.cause}: ${mess}`;
		}
	}
	return mess;
}

export async function exceptionFromResponse(response: Response): Promise<Error> {
	let errorData = { message: '' };
	try {
		errorData = await response.json();
	} catch { }

	const translatedMessage = getStatusTranslation(response.status);
	const message = translatedMessage || errorData.message || response.statusText;
	return new Error(message);
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

export function getStatusTranslation(status: number): string | undefined {
	const errDict = currentDictionary.error as any;

	const map: Record<number, string | undefined> = {
		400: errDict.bad_request || "Bad Request",
		401: errDict.unauthorized || "Unauthorized",
		404: currentDictionary.error.page404 || "Not Found",
		409: errDict.conflict || "Conflict: Resource already exists"
	};

	return map[status];
}
