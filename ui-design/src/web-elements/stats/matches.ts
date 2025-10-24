import type { inlineMatchResult } from '../../types-interfaces';

export class InlineMatch extends HTMLDivElement {
    #data: inlineMatchResult;
	#header: boolean;

    constructor() {
        super();
		this.#header = false;
        this.#data = {
            date: 'f',
            opponent: 'f',
            outcome: 'f',
            score: 'f',
            duration: 'f',
        };

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
            span.textContent = this.#data[key as keyof inlineMatchResult]
            span.id = key;
			this.append(span);
			if (this.#header) {
				span.classList.add('f-bold', 'f-orange')
			}
        }
    }
    connectedCallback() {
		this.createSpans();
		this.render();
	}

    render() {
		this.className = 'border-box w-full grid grid-flow-col place-content-evenly justify-items-center'
	}
}

if (!customElements.get('inline-match')) {
	customElements.define('inline-match', InlineMatch, { extends: 'div' });
}
