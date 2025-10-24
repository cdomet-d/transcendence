import * as types from '../../types-interfaces';
import * as defaults from '../../default-values';
import { createInputGroup, createTextAreaGroup } from '../inputs/helpers';
import type { InputGroup, TextAreaGroup } from '../inputs/fields';
import { createBtn } from '../navigation/helpers';
import { createHeading } from '../typography/helpers';
export class BaseForm extends HTMLFormElement {
    #formData: types.formDetails;
    #submitHandler: (ev: SubmitEvent) => void;

    constructor() {
        super();
        this.#formData = defaults.emptyForm;
        this.#submitHandler = this.submitHandler.bind(this);
        this.className = 'grid gap-s pad-s w-full justify-items-center';
    }

    set details(form: types.formDetails) {
        this.#formData = form;
    }

    get details() {
        return this.#formData;
    }

    submitHandler(ev: SubmitEvent) {
        ev.preventDefault();
        const formResults = new FormData(this);
        console.log(formResults);
    }

    renderFields() {
        this.#formData.fields.forEach((field) => {
            let el: HTMLElement;
            if (field.type !== 'textarea') {
                el = createInputGroup(field) as InputGroup;
            } else {
                el = createTextAreaGroup(field) as TextAreaGroup;
            }
            this.appendChild(el);
            if (field.type === 'textarea') el.classList.add('row-span-3');
        });
    }

    renderButtons() {
        const submit = createBtn(this.#formData.button);
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
        const title = createHeading('1', this.#formData.heading);
        this.append(title);
        this.renderFields();
        this.renderButtons();
    }
}
