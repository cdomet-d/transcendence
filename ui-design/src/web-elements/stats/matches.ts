import type { MatchOutcome } from '../../types-interfaces';

export function createMatchOutcome(match: MatchOutcome): InlineMatch {
    const el = document.createElement('div', { is: 'inline-match' }) as InlineMatch;
    el.match = match;
    el.createSpans();
    return el;
}

export class InlineMatch extends HTMLDivElement {
    #data: MatchOutcome;

    constructor() {
        super();
        this.#data = {
            date: '',
            opponent: '',
            outcome: '',
            score: '',
            duration: '',
            tournament: false,
        };
    }

    set match(matchOutcome: MatchOutcome) {
        this.#data = matchOutcome;
    }

    createHeader(): InlineMatch {
        for (const key in this.#data) {
            const span = document.createElement('span');
            this.append(span);
            span.classList.add('f-bold', 'f-orange');
            span.classList.add('text-center');
            span.id = key;
            span.textContent = key;
        }
        this.classList.add('bg-yellow');
        return this;
    }

    //TODO: probably should add link to opponent profile
    createSpans(): InlineMatch {
        for (const key in this.#data) {
            const span = document.createElement('span');
            this.append(span);
            span.id = key;
            span.textContent = this.#data[key as keyof MatchOutcome].toString();
        }
        return this;
    }
    connectedCallback() {
        this.render();
    }

    render() {
        this.classList.add('box-border', 'grid', 'grid-cols-6', 'text-center');
    }
}

if (!customElements.get('inline-match')) {
    customElements.define('inline-match', InlineMatch, { extends: 'div' });
}

export class MatchHistory extends HTMLDivElement {
    constructor() {
        super();
    }

    setHistory(matches: MatchOutcome[]) {
        const header = document.createElement('div', { is: 'inline-match' }) as InlineMatch;
        this.append(header.createHeader());

        matches.forEach((el) => {
            this.append(createMatchOutcome(el));
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.id = 'match-history';
        this.classList.add('grid', 'grid-flow-rows');
    }
}

if (!customElements.get('match-history')) {
    customElements.define('match-history', MatchHistory, { extends: 'div' });
}
