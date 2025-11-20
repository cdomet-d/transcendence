import { renderProfile } from '../../render-pages';
import { BaseForm } from './baseform';

export class LoginForm extends BaseForm {
    constructor() {
        super();
    }

    override async sendForm(url: string, req: RequestInit): Promise<Response> {
        try {
            const response = await fetch(url, req);
            if (!response.ok)
                throw new Error(`HTTP Error: ${response.status}: duplicate ressource`);
            if (typeof req.body === 'string') {
                const payload = JSON.parse(req.body);

                window.history.pushState({}, '', `/user/${payload.username}`);
                renderProfile({
                    path: `/user/:${payload.username}`,
                    params: { login: payload.username },
                });
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}

if (!customElements.get('login-form')) {
    customElements.define('login-form', LoginForm, { extends: 'form' });
}
