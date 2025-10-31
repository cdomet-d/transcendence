import type { InputGroup, TextAreaGroup } from '../inputs/fields';
import type { FormDetails } from '../../types-interfaces';

import { emptyForm } from '../../default-values';
import { createInputGroup, createTextAreaGroup } from '../inputs/helpers';
import { createHeading } from '../typography/helpers';
import { createBtn } from '../navigation/buttons-helpers';

/**
 * The parent class from which all forms derives.
 *
 * It handles field and button rendering, as well as setting up a default submit behavior that can be overidden in descendant classes.
 * @class BaseForm
 * @remarks customElement name is `'default-form'`
 * @extends {HTMLFormElement}
 */
export class BaseForm extends HTMLFormElement {
    #formData: FormDetails;
    #submitHandler: (ev: SubmitEvent) => void;

    /**
     * A map-like object to store the individual elements of a form to allow repositionning and easy manipulation.
     * It's basically a cache.
     */
    #formContent: { [key: string]: HTMLElement };

    constructor() {
        super();
        this.#formData = emptyForm;
        this.#submitHandler = this.submitHandler.bind(this);
        this.className = 'w-full grid row-l gap-s place-items-center justify-center box-border';
        this.#formContent = {};
    }

    set details(form: FormDetails) {
        this.#formData = form;
    }

    get details() {
        return this.#formData;
    }

    /**
     * Getter for `formContent`, the form's cache.
     */
    get contentMap() {
        return this.#formContent;
    }

    /**
     * Handles the default submit event for the form.
     * Prevents default submission and logs form data.
     * Can be overridden in subclasses for custom behavior.
     * @param ev - The submit event.
     */
    submitHandler(ev: SubmitEvent) {
        ev.preventDefault();
        const formResults = new FormData(this);
        console.log(formResults);
    }

    /**
     * Renders the form title if a heading is provided in form details.
     * Appends the title element to the form and caches it in `formContent`.
     */
    renderTitle() {
        if (this.#formData.heading) {
            const title = createHeading('1', this.#formData.heading);
            this.#formContent['title'] = title;
            this.append(title);
        }
    }

    /**
     * Renders all fields defined in the form details.
     * Creates input or textarea groups as needed, appends them, and caches them in `formContent`.
     */
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
            this.append(el);
            if (field.type === 'textarea') el.classList.add('row-span-3');
        });
    }

    /**
     * Renders the form's submit button as defined in form details.
     * Appends the button to the form and caches it in `formContent`.
     */
    renderButtons() {
        const submit = createBtn(this.#formData.button);
        this.#formContent['submit'] = submit;
        this.append(submit);
    }

    /**
     * Called when the element is inserted into the DOM.
     * Sets form attributes, attaches the submit event handler, and renders the form.
     */
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

    /**
     * Renders the form by calling the title, fields, and button renderers.
     */
    render() {
        this.renderTitle();
        this.renderFields();
        this.renderButtons();
    }
}

if (!customElements.get('default-form')) {
    customElements.define('default-form', BaseForm, { extends: 'form' });
}
