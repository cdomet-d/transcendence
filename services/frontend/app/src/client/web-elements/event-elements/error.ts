export async function responseErrorMessage(response: Response): Promise<Error> {
    const errorData = await response.json();
    return new Error(`Error: ${response.status}: ${errorData.message}`);
}

export class BadRequest extends HTMLSpanElement {
    constructor() {
        super();
    }

    set content(str: string) {
        this.innerText = str;
        this.render();
    }

    connectedCallback() {
        this.className = 'absolute top-0 bg-red w-full h-m pad-xs';
        this.render();
    }

    render() {}
}

if (!customElements.get('bad-request')) {
    customElements.define('bad-request', BadRequest, { extends: 'span' });
}
