import { BaseForm } from './baseform';
import { renderProfile } from '../../render-pages';
import { responseErrorMessage } from '../event-elements/error';
import { updateURL } from '../navigation/links';

export class LoginForm extends BaseForm {
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

if (!customElements.get('login-form')) {
    customElements.define('login-form', LoginForm, { extends: 'form' });
}
