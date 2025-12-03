import { BaseForm } from './baseform';
import { router } from '../../main';
import { exceptionFromResponse, createVisualFeedback, errorMessageFromException } from '../../error';

export class RegistrationForm extends BaseForm {
    constructor() {
        super();
    }

    override async fetchAndRedirect(url: string, req: RequestInit) {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw await exceptionFromResponse(response);
            if (typeof req.body === 'string') {
                document.body.header?.notif.notifWsRequest();
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
            if (!response.ok) throw await exceptionFromResponse(response);
            document.body.header?.notif.notifWsRequest();
            router.loadRoute('/me', true);
        } catch (error) {
            createVisualFeedback(errorMessageFromException(error));
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
		console.log('bitch');
    }

	override async submitHandlerImplementation(ev: SubmitEvent): Promise<void> {
		ev.preventDefault();
		const form = new FormData(this);
		console.log(super.createReqBody(form))
	}
}

if (!customElements.get('pw-form')) {
    customElements.define('pw-form', CriticalActionForm, { extends: 'form' });
}

