import { BaseForm } from './baseform.js';
import { router } from '../../main.js';
import { createVisualFeedback } from '../../error.js';
import { errorMessageFromException } from '../../error.js';

export class PrivacyButtonForm extends BaseForm {

	constructor() {
		super();
		this.submitHandler = this.submitHandlerImplementation.bind(this);
	}

	override async submitHandlerImplementation(ev: SubmitEvent): Promise<void> {
		ev.preventDefault();
		router.loadRoute('/privacy', true);
	}

	override async fetchAndRedirect(_url: string, _req: RequestInit): Promise<void> {
		try {
			router.loadRoute('/auth', true);
		} catch (error) {
			console.error('[DELETE ACCOUNT]', error);
			createVisualFeedback(errorMessageFromException(error));
		}
	}
}

if (!customElements.get('privacy-button-form')) {
	customElements.define('privacy-button-form', PrivacyButtonForm, { extends: 'form' });
}