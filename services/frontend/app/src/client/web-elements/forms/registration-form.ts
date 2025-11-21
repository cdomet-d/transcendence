import { BaseForm } from './baseform';
import { renderProfile } from '../../render-pages';
import { responseErrorMessage } from '../event-elements/error';
import { updateURL } from '../navigation/links';

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
                updateURL(`/user/${payload.username}`);
                renderProfile({
                    path: `/user/:${payload.username}`,
                    params: { login: payload.username },
                });
            }
        } catch (error) {
            throw error;
        }
    }
}

if (!customElements.get('registration-form')) {
    customElements.define('registration-form', RegistrationForm, { extends: 'form' });
}
