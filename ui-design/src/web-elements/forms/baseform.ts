import type { InputGroup, TextAreaGroup } from '../inputs/fields';
import type { FormDetails } from '../../types-interfaces';

import { emptyForm } from '../../default-values';
import { createInputGroup, createTextAreaGroup } from '../inputs/helpers';
import { createHeading } from '../typography/helpers';
import { createBtn } from '../navigation/buttons-helpers';

export class BaseForm extends HTMLFormElement {
    #formData: FormDetails;
    #formContent: { [key: string]: HTMLElement };
    #submitHandler: (ev: SubmitEvent) => void;

    constructor() {
        super();
        this.#formData = emptyForm;
        this.#submitHandler = this.submitHandler.bind(this);
        this.className =
            'w-full grid row-l gap-s place-items-center justify-center box-border';
        this.#formContent = {};
    }

    set details(form: FormDetails) {
        this.#formData = form;
    }

    get details() {
        return this.#formData;
    }

    get contentMap() {
        return this.#formContent;
    }

    submitHandler(ev: SubmitEvent) {
        ev.preventDefault();
        const formResults = new FormData(this);
        console.log(formResults);
    }

    renderTitle() {
        if (this.#formData.heading) {
            const title = createHeading('1', this.#formData.heading);
            this.#formContent['title'] = title;
            this.append(title);
        }
    }

    renderFields() {
        this.#formData.fields.forEach((field) => {
            let el: HTMLElement;
            if (field.type !== 'textarea') {
                el = createInputGroup(field) as InputGroup;
                this.#formContent[field.id] = el;
            } else {
                el = createTextAreaGroup(field) as TextAreaGroup;
                this.#formContent[field.id] = el;
            }
            this.appendChild(el);
            if (field.type === 'textarea') el.classList.add('row-span-3');
        });
    }

    renderButtons() {
        const submit = createBtn(this.#formData.button);
        this.#formContent['submit'] = submit;
        this.append(submit);
    }

    connectedCallback() {
        this.action = this.#formData.action;
        this.ariaLabel = this.#formData.ariaLabel;
        this.id = this.#formData.id;
        this.method = this.#formData.method;
        this.addEventListener('submit', (ev) => this.#submitHandler(ev));
        this.render();
    }

    disconnectedCallback() {
        this.removeEventListener('submit', (ev) => this.#submitHandler(ev));
    }

    render() {
        this.renderTitle();
        this.renderFields();
        this.renderButtons();
    }
}

if (!customElements.get('default-form')) {
    customElements.define('default-form', BaseForm, { extends: 'form' });
}
