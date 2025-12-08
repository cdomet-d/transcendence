import { BaseForm } from './baseform.js';
import { CriticalActionForm } from './auth.js';
import { exceptionFromResponse, createVisualFeedback, errorMessageFromException } from '../../error.js';
import type { UserData } from '../types-interfaces.js';
import { currentDictionary } from './language.js';
import { downloadData } from './default-forms.js';
import { user } from '../default-values.js';

export class DowloadDataForm extends BaseForm {
	#user: UserData;

	constructor() {
		super();
		this.submitHandler = this.submitHandlerImplementation.bind(this);
		this.#user = user;
	}

	override async submitHandlerImplementation(ev: SubmitEvent): Promise<void> {
		ev.preventDefault();

		// [FIX] Ensure we have a username before attempting download
		if (!this.#user || !this.#user.username) {
			console.error("User data missing for download");
			createVisualFeedback("User data not available", "error");
			return;
		}

		try {
			await CriticalActionForm.show();

			// [FIX] Dynamically construct URL to ensure it uses the current username
			// This prevents 404 errors caused by stale URLs generated during initialization
			const actionUrl = `https://localhost:8443/api/bff/profile/${this.#user.username}`;

			const req: RequestInit = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
			};

			await this.fetchAndRedirect(actionUrl, req);

		} catch (error) {
			console.log('Downloading stopped:', error);
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

		try {
			const response = await fetch(url, req);
			if (!response.ok) throw await exceptionFromResponse(response);

			// [FIX] Actually download the file (convert response to Blob)
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = downloadUrl;
			// Use the username in the filename if available, fallback to 'export'
			a.download = `user_data_${this.#user?.username || 'export'}.json`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(downloadUrl);

			localStorage.removeItem('criticalChange');
			createVisualFeedback('Data downloaded!', 'success');

		} catch (error) {
			console.error('[DOWNLOAD DATA ERROR]', error);
			createVisualFeedback(errorMessageFromException(error));
		}
	}

	set user(details: UserData) {
		this.#user = details;
		// [FIX] Handle potential undefined username safely for the form details
		const safeUsername = details?.username || '';
		this.details = downloadData(currentDictionary, safeUsername);
	}
}

if (!customElements.get('download-data-request')) {
	customElements.define('download-data-request', DowloadDataForm, { extends: 'form' });
}