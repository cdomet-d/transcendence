import { BaseForm } from './baseform';

export class LoginForm extends BaseForm {
    constructor() {
        super();
    }

    override async sendForm(url: string, req: RequestInit): Promise<Response> {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            console.log('Fetch successful', response);
            // get params from request
            console.log("BODY", req.body);
            // feed them to login form
            // await its response
            // if successful redirect to UserProfile
            return response;
        } catch (error) {
            console.error('Fetch failed', error);
            throw error;
        }
    }
}

if (!customElements.get('login-form')) {
    customElements.define('login-form', LoginForm, { extends: 'form' });
}
