import { BaseForm } from './baseform';
import { router } from '../../main';
import { errorMessageFromResponse } from '../../error';

export class RegistrationForm extends BaseForm {
    constructor() {
        super();
    }

    override async fetchAndRedirect(url: string, req: RequestInit) {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw await errorMessageFromResponse(response);
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

export class LoginForm extends BaseForm {
    constructor() {
        super();
    }

    override async fetchAndRedirect(url: string, req: RequestInit) {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw await errorMessageFromResponse(response);
            router.loadRoute(router.stepBefore, true);
        } catch (error) {
            throw error;
        }
    }
}

if (!customElements.get('login-form')) {
    customElements.define('login-form', LoginForm, { extends: 'form' });
}

export class CriticalActionForm extends BaseForm {
    constructor() {
        super();
    }

    override async fetchAndRedirect(url: string, req: RequestInit) {
		return;
    }

	override async submitHandlerImplementation(ev: SubmitEvent): Promise<void> {
		ev.preventDefault();
		const form = new FormData(this);
		super.createReqBody(form);
		console.log(super.createReqBody(form))
	}
}

if (!customElements.get('login-form')) {
    customElements.define('login-form', CriticalActionForm, { extends: 'form' });
}

