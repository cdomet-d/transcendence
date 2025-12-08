import { BaseForm } from './baseform.js';
import { CriticalActionForm } from './auth.js';
import { exceptionFromResponse, createVisualFeedback, errorMessageFromException } from '../../error.js';
import { router } from '../../main.js';

export class DeleteAccountForm extends BaseForm {

	constructor() {
		super();
		this.submitHandler = this.submitHandlerImplementation.bind(this);
	}

	override async submitHandlerImplementation(ev: SubmitEvent): Promise<void> {
		ev.preventDefault();

		try {
			await CriticalActionForm.show();

			const req: RequestInit = {
				method: this.details.method || 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({})
			};

			await this.fetchAndRedirect(this.details.action, req);

		} catch (error) {
			console.log('Account deletion flow stopped:', error);
		}
	}

	override async fetchAndRedirect(url: string, req: RequestInit): Promise<void> {
		const storedToken = localStorage.getItem('criticalChange');

		if (storedToken) {
			try {
				const { token } = JSON.parse(storedToken);

				const headers = new Headers(req.headers || {});
				headers.set('Authorization', `Bearer ${token}`);

				if (!headers.has('Content-Type'))
					headers.set('Content-Type', 'application/json');

				req.headers = headers;
			} catch (e) {
				console.error('Error parsing critical token', e);
			}
		}
		if (!req.body)
			req.body = JSON.stringify({});

		try {
			const response = await fetch(url, req);
			if (!response.ok) throw await exceptionFromResponse(response);

			localStorage.removeItem('criticalChange');

			router.loadRoute('/auth', true);
			createVisualFeedback('Account permanently deleted', 'success');

		} catch (error) {
			console.error('[DELETE ACCOUNT]', error);
			createVisualFeedback(errorMessageFromException(error));
		}
	}
}

if (!customElements.get('delete-account-form')) {
	customElements.define('delete-account-form', DeleteAccountForm, { extends: 'form' });
}