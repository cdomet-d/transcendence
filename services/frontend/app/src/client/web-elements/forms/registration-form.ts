import { BaseForm } from './baseform';
import { router } from '../../main';
import { exceptionFromResponse } from '../../error';

export class RegistrationForm extends BaseForm {
    constructor() {
        super();
    }

    override async fetchAndRedirect(url: string, req: RequestInit) {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw await exceptionFromResponse(response);
            if (typeof req.body === 'string') {
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
