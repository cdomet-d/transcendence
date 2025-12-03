import { BaseForm } from './baseform';
import { errorMessageFromResponse } from '../../error';
import { router } from '../../main';

export class LoginForm extends BaseForm {
    constructor() {
        super();
    }

    override async fetchAndRedirect(url: string, req: RequestInit) {
        try {
            const response = await fetch(url, req);
            if (!response.ok) throw await errorMessageFromResponse(response);
            //TODO:request db for pending friend request
            document.body.header?.notif.notifWsRequest();
            router.loadRoute(router.stepBefore, true);
        } catch (error) {
            throw error;
        }
    }
}

if (!customElements.get('login-form')) {
    customElements.define('login-form', LoginForm, { extends: 'form' });
}
