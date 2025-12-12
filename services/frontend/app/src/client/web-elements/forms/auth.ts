import { BaseForm } from './baseform';
import { router } from '../../main';
import { exceptionFromResponse, createVisualFeedback, errorMessageFromException } from '../../error';
import { createForm } from './helpers';
import { criticalChange } from './default-forms';
import { Popup } from '../layouts/popup';
import { currentDictionary } from './language';

export class RegistrationForm extends BaseForm {
	constructor() {
		super();
	}

	override async fetchAndRedirect(url: string, req: RequestInit) {
		try {
			const response = await fetch(url, req);
			if (!response.ok) throw await exceptionFromResponse(response);
			if (typeof req.body === 'string') {
				document.body.header?.notif.notifWsRequest();
				router.loadRoute('/me', true);
			}
		} catch (error) {
			throw error;
		}
	}
}

if (!customElements.get('registration-form')) {
	customElements.define('registration-form', RegistrationForm, { extends: 'form' });
}

export class LoginForm extends BaseForm {
	constructor() {
		super();
	}

	override async fetchAndRedirect(url: string, req: RequestInit) {
		try {
			const response = await fetch(url, req);
			if (!response.ok) throw await exceptionFromResponse(response);
			await document.body.header?.notif.fetchPendingFriendRequests();
			await document.body.header?.notif.fetchGameInvites();
			document.body.header?.notif.notifWsRequest();
			router.loadRoute('/me', true);
		} catch (error) {
			console.error('[LOGIN FORM]', errorMessageFromException(error));
			createVisualFeedback(errorMessageFromException(currentDictionary.error.something_wrong));
		}
	}
}

if (!customElements.get('login-form')) {
	customElements.define('login-form', LoginForm, { extends: 'form' });
}

export class CriticalActionForm extends BaseForm {
	#resolve?: (value: string) => void;
	#reject?: (error: Error) => void;
	#escapeHandler: (ev: KeyboardEvent) => void;

	constructor() {
		super();
		this.#escapeHandler = this.#escapeImplementation.bind(this);
	}

	override connectedCallback(): void {
		super.connectedCallback();
		this.addEventListener('keydown', this.#escapeHandler);
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.removeEventListener('keydown', this.#escapeHandler);
	}

	#escapeImplementation(ev: KeyboardEvent) {
		if (ev && ev.key === 'Escape') {
			if (this.parentElement) this.parentElement?.remove();
			else this.remove();
		}
	}

	static show(): Promise<string> {
		const dialog = document.createElement('dialog', { is: 'custom-popup' }) as Popup;
		const form = createForm('pw-form', criticalChange());
		form.classList.add('bg', 'brdr', 'pad-s');
		document.body.layoutInstance?.appendAndCache(dialog);
		dialog.appendAndCache(form);
		dialog.showModal();
		return form.#awaitSubmission();
	}

	#awaitSubmission(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.#resolve = resolve;
			this.#reject = reject;
		});
	}

	override async fetchAndRedirect(url: string, req: RequestInit) {
		try {
			const response = await fetch(url, req);
			if (!response.ok) throw await exceptionFromResponse(response);
			const critical = await response.json();
			localStorage.setItem('criticalChange', JSON.stringify(critical));
			console.log(critical);
			this.#resolve?.(JSON.stringify(critical));
		} catch (error) {
			console.error('[CRITICAL CHANGE FORM]', errorMessageFromException(error));
			createVisualFeedback(errorMessageFromException(currentDictionary.error.something_wrong));
			this.#reject?.(error as Error);
		}
		document.body.layoutInstance?.components.get('popup')?.remove();
	}
}

if (!customElements.get('pw-form')) {
	customElements.define('pw-form', CriticalActionForm, { extends: 'form' });
}
