import type { Feedback } from '../types-interfaces';

export async function responseErrorMessage(response: Response): Promise<Error> {
    const errorData = await response.json();
    return new Error(`Error: ${response.status}: ${errorData.message}`);
}

export class UIFeedback extends HTMLSpanElement {
    constructor() {
        super();
    }

    set content(str: string) {
        this.innerText = str;
        this.render();
    }

    set type(type: Feedback) {
        console.log('in type');
        type === 'error'
            ? this.classList.add('bg-red', 'invalid')
            : this.classList.add('bg-green', 'valid');
    }

    connectedCallback() {
        this.className = 'absolute bottom-0 w-full h-m pad-xs brdr';
        this.render();
    }

    render() {}
}

if (!customElements.get('ui-feedback')) {
    customElements.define('ui-feedback', UIFeedback, { extends: 'span' });
}
