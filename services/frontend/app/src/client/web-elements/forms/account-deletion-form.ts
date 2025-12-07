import { BaseForm } from './baseform';
import { exceptionFromResponse } from '../../error';
import { redirectOnError } from '../../error';

export class DeleteAccountForm extends BaseForm {
	override async fetchAndRedirect(url: string, req: RequestInit): Promise<void> {
		console.log('Account deletion payload:', JSON.stringify(req.body));
		if (!req.body) {
			req.body = JSON.stringify({});
		}
		try {
			const response = await fetch(url, req);
			if (!response.ok) throw await exceptionFromResponse(response);
			if (typeof req.body === 'string') {
				const payload = JSON.parse(req.body);
			}
		} catch (error) {
			throw error;
		}
		redirectOnError('/auth', 'Account permanently deleted');
	}
}

if (!customElements.get('delete-account-form')) {
	customElements.define('delete-account-form', DeleteAccountForm, { extends: 'form' });
}
