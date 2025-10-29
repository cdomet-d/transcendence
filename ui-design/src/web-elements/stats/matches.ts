import type { inlineMatchResult } from '../../types-interfaces';

export class InlineMatch extends HTMLDivElement {
    #data: inlineMatchResult;
    #header: boolean;

    constructor() {
        super();
        this.#header = false;
        this.#data = { date: '', opponent: '', outcome: '', score: '', duration: '' };
    }

    set match(matchOutcome: inlineMatchResult) {
        this.#data = matchOutcome;
    }

    set header(isHeader: boolean) {
        this.#header = isHeader;
    }

    createSpans() {
        for (const key in this.#data) {
            const span = document.createElement('span');
            this.append(span);
            span.id = key;
            if (this.#header) {
                span.classList.add('f-bold', 'f-orange');
                span.textContent = key;
            } else span.textContent = this.#data[key as keyof inlineMatchResult];
        }
    }
    connectedCallback() {
        this.createSpans();
        this.render();
    }

    render() {
        this.className = 'box-border grid grid-flow-col place-content-evenly justify-items-center';
    }
}

if (!customElements.get('inline-match')) {
    customElements.define('inline-match', InlineMatch, { extends: 'div' });
}
