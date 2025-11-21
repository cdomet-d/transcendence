import { BaseForm } from './baseform';
import { router } from '../../main';
import { responseErrorMessage } from '../event-elements/error';

export class RegistrationForm extends BaseForm {
    constructor() {
        super();
    }

    override async fetchAndRedirect(url: string, req: RequestInit) {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw await responseErrorMessage(response);
            if (typeof req.body === 'string') {
                const payload = JSON.parse(req.body);
                router.loadRoute(`/user/${payload.username}`);
            }
        } catch (error) {
            throw error;
        }
    }
}

if (!customElements.get('registration-form')) {
    customElements.define('registration-form', RegistrationForm, { extends: 'form' });
}
