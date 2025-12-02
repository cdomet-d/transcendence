import { BaseForm } from './baseform';
import { errorMessageFromResponse } from '../../error';

export class DeleteAccountForm extends BaseForm {
    override async fetchAndRedirect(url: string, req: RequestInit): Promise<void> {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw await errorMessageFromResponse(response);
            if (typeof req.body === 'string') {
                const payload = JSON.parse(req.body);
                console.log(payload);
            }
        } catch (error) {
            throw error;
        }
    }
}

if (!customElements.get('delete-account-form')) {
    customElements.define('delete-account-form', DeleteAccountForm, { extends: 'form' });
}
