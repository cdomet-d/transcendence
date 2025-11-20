import { renderProfile } from '../../render-pages';
import { BaseForm } from './baseform';

export class RegistrationForm extends BaseForm {
    constructor() {
        super();
    }

    override async sendForm(url: string, req: RequestInit): Promise<Response> {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            console.log('Fetch successful', response);
            if (typeof req.body === 'string') {
                const payload = JSON.parse(req.body);

                window.history.pushState({}, '', `/user/${payload.username}`);
                renderProfile({
                    path: `/user/:${payload.username}`,
                    params: { login: payload.username },
                });
            } else {
                console.log('Error: Could not parse request.body (`body` is not `String` type');
            }
            return response;
        } catch (error) {
            console.error('Fetch failed', error);
            throw error;
        }
    }
}

if (!customElements.get('registration-form')) {
    customElements.define('registration-form', RegistrationForm, { extends: 'form' });
}
