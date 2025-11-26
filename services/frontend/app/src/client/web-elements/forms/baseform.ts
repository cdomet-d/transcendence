import type { InputGroup, TextAreaGroup } from '../inputs/fields.js';
import type { FormDetails } from '../types-interfaces.js';
import { createInputGroup, createTextAreaGroup } from '../inputs/helpers.js';
import { createHeading } from '../typography/helpers.js';
import { createButton } from '../navigation/buttons-helpers.js';
import { UIFeedback } from '../event-elements/error';

const emptyForm: FormDetails = {
    action: '',
    ariaLabel: '',
    button: { id: '', type: 'button', content: '', img: null, ariaLabel: '' },
    fields: [],
    heading: '',
    id: '',
    method: '',
};

/** The parent class from which all forms derives.
 *
 * It handles field and button rendering, as well as setting up a default submit behavior that can be overidden in descendant classes.
 * @class BaseForm
 * @remarks customElement name is `'default-form'`
 * @extends {HTMLFormElement}
 */
export abstract class BaseForm extends HTMLFormElement {
    #formData: FormDetails;
    submitHandler: (ev: SubmitEvent) => void;
    validationHandler: () => void;

    /** A map storing the individual elements of a form to allow easy manipulation.
     * It's basically a cache.
     */
    #formContent: Map<string, HTMLElement>;

    /* -------------------------------------------------------------------------- */
    /*                                   Default                                  */
    /* -------------------------------------------------------------------------- */

    constructor() {
        super();
        this.#formData = emptyForm;
        this.submitHandler = this.submitHandlerImplementation.bind(this);
        this.validationHandler = this.#validate.bind(this);
        this.#formContent = new Map<string, HTMLElement>();
        this.className =
            'w-full h-full grid grid-auto-rows-auto form-gap place-items-center justify-center box-border pad-m relative';
    }

    /** Called when the element is inserted into the DOM.
     * Sets form attributes, attaches the submit event handler, and renders the form.
     */
    connectedCallback() {
        this.action = this.#formData.action;
        this.ariaLabel = this.#formData.ariaLabel;
        this.id = this.#formData.id;
        this.method = this.#formData.method;
        this.addEventListener('submit', this.submitHandler);
        this.addEventListener('input', this.validationHandler);
        this.render();
    }

    disconnectedCallback() {
        this.removeEventListener('submit', this.submitHandler);
        this.removeEventListener('input', this.validationHandler);
    }
    /** Renders the form by calling the title, fields, and button renderers.
     */
    render() {
        this.renderTitle();
        this.renderFields();
        this.renderButtons();
        this.#validate();
    }

    abstract fetchAndRedirect(url: string, req: RequestInit): Promise<void>;

    /* -------------------------------------------------------------------------- */
    /*                                   Setters                                  */
    /* -------------------------------------------------------------------------- */

    /**
     * Sets the details of the form - expects a {@link FormDetails} object.
     * Can also be `got`.
     */
    set details(form: FormDetails) {
        this.#formData = form;
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Getters                                  */
    /* -------------------------------------------------------------------------- */

    get details() {
        return this.#formData;
    }

    /**
     * Getter for `formContent`, the form's cache.
     */
    get contentMap() {
        return this.#formContent;
    }

    // TODO: add getter for single element
    /* -------------------------------------------------------------------------- */
    /*                            Event listeners                                 */
    /* -------------------------------------------------------------------------- */

    createReqBody(form: FormData): string {
        const fObject = Object.fromEntries(form.entries());
        const jsonBody = JSON.stringify(fObject);
        return jsonBody;
    }

    initReq(): RequestInit {
        const req: RequestInit = {
            method: this.#formData.method,
            headers: { 'Content-Type': 'application/json' },
        };
        return req;
    }

    /** Handles the default submit event for the form.
     * Prevents default submission and log form data.
     * Can be overridden in subclasses for custom behavior.
     * @param ev - The submit event.
     */
    async submitHandlerImplementation(ev: SubmitEvent) {
        ev.preventDefault();
        const form = new FormData(this);
        const req = this.initReq();
        if (req.method === 'post') {
            req.body = this.createReqBody(form);
        }
        try {
            await this.fetchAndRedirect(this.#formData.action, req);
        } catch (error) {
            let mess = 'Something when wrong';
            const err = document.createElement('span', { is: 'ui-feedback' }) as UIFeedback;
            if (error instanceof Error) mess = error.message;
            document.body.layoutInstance?.append(err);
            err.content = mess;
            err.type = 'error';
        }
    }

    #validate() {
        if (!this.checkValidity()) {
            this.#formContent.get('submit')?.setAttribute('disabled', '');
        } else {
            this.#formContent.get('submit')?.removeAttribute('disabled');
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Rendering                                 */
    /* -------------------------------------------------------------------------- */

    /** Renders the form title if a heading is provided in form details.
     * Appends the title element to the form and caches it in `formContent`.
     */
    renderTitle() {
        if (this.#formData.heading) {
            const title = createHeading('1', this.#formData.heading);
            this.#formContent.set('title', title);
            this.append(title);
        }
    }

    /** Renders all fields defined in the form details.
     * Creates input or textarea groups as needed, appends them, and caches
     * them in `formContent`.
     */
    renderFields() {
        this.#formData.fields.forEach((field) => {
            let el: HTMLElement;
            if (field.type !== 'textarea') {
                el = createInputGroup(field) as InputGroup;
                this.#formContent.set(field.id, el);
            } else {
                el = createTextAreaGroup(field) as TextAreaGroup;
                this.#formContent.set(field.id, el);
            }
            this.append(el);
            el.classList.remove('w-full');
            el.classList.add('w-5/6', 'z-2');
            if (field.type === 'textarea') el.classList.add('row-span-3', 'h-full');
        });
    }

    /** Renders the form's submit button as defined in form details.
     * Appends the button to the form and caches it in `formContent`.
     */
    renderButtons() {
        const submit = createButton(this.#formData.button);
        this.#formContent.set('submit', submit);
        this.append(submit);
        if (!submit.classList.contains('bg-red')) {
            submit.classList.remove('w-full');
            submit.classList.add('w-5/6');
        }
    }
}
