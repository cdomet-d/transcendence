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
