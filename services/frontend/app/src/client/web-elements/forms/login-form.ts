import { BaseForm } from './baseform';
import {
    createVisualFeedback,
    errorMessageFromException,
    exceptionFromResponse,
} from '../../error';
import { router } from '../../main';

export class LoginForm extends BaseForm {
    constructor() {
        super();
    }

    override async fetchAndRedirect(url: string, req: RequestInit) {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw await exceptionFromResponse(response);
			await document.body.header?.notif.fetchPendingFriendRequests();
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
