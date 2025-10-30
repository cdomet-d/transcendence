// import { tournament } from '../../default-values';
import type { matchOutcome } from '../../types-interfaces';

export class InlineMatch extends HTMLDivElement {
    #data: matchOutcome;

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

    set match(matchOutcome: matchOutcome) {
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
            span.textContent = this.#data[key as keyof matchOutcome].toString();
            span.classList.add('text-center');
        }
        return this;
    }
    connectedCallback() {
        this.render();
    }

    render() {
        this.classList.add('box-border', 'grid', 'grid-cols-6');
    }
}

if (!customElements.get('inline-match')) {
    customElements.define('inline-match', InlineMatch, { extends: 'div' });
}

export class MatchHistory extends HTMLDivElement {
    constructor() {
        super();
    }

    setHistory(matches: matchOutcome[]) {
        const header = document.createElement('div', { is: 'inline-match' }) as InlineMatch;
        this.append(header.createHeader());

        matches.forEach((el) => {
            const match = document.createElement('div', { is: 'inline-match' }) as InlineMatch;
            match.match = el;
            this.append(match.createSpans());
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.classList.add('grid', 'grid-flow-rows');
    }
}

if (!customElements.get('match-history')) {
    customElements.define('match-history', MatchHistory, { extends: 'div' });
}
