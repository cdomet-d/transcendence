import { BaseForm } from './baseform';

export class AccountCreationForm extends BaseForm {
	
}

if (!customElements.get('account-creation-form')) {
    customElements.define('account-creation-form', AccountCreationForm, { extends: 'form' });
}
