import { BaseForm } from './baseform';
import { responseErrorMessage } from '../event-elements/error';
import { router } from '../../main';

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
                router.loadRoute(`/user/${payload.username}`);
            }
        } catch (error) {
            throw error;
        }
    }
}

if (!customElements.get('login-form')) {
    customElements.define('login-form', LoginForm, { extends: 'form' });
}
