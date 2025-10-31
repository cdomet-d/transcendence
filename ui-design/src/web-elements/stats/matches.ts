import type { MatchOutcome } from '../../types-interfaces';

/**
 * Creates an InlineMatch element and populates it with match outcome data.
 * @param match - The match outcome data.
 * @returns {InlineMatch} The populated InlineMatch element.
 */
export function createMatchOutcome(match: MatchOutcome): InlineMatch {
    const el = document.createElement('div', { is: 'inline-match' }) as InlineMatch;
    el.match = match;
    el.createSpans();
    return el;
}

/**
 * Custom element representing a single match outcome in an inline format.
 * Displays match details as spans.
 * Extends HTMLDivElement.
 */
export class InlineMatch extends HTMLDivElement {
    #data: MatchOutcome;

    /**
     * Initializes the InlineMatch element with default data.
     */
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

    /**
     * Sets the match outcome data for this element.
     * @param matchOutcome - The match outcome data.
     */
    set match(matchOutcome: MatchOutcome) {
        this.#data = matchOutcome;
    }

    /**
     * Creates and appends header spans for each match property.
     * @returns {InlineMatch} The InlineMatch element with header spans.
     */
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
    /**
     * Creates and appends spans for each match property value.
     * @returns {InlineMatch} The InlineMatch element with value spans.
     */
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

    /**
     * Renders the InlineMatch element with default styles.
     */
    render() {
        this.classList.add('box-border', 'grid', 'grid-cols-6', 'text-center');
    }
}

if (!customElements.get('inline-match')) {
    customElements.define('inline-match', InlineMatch, { extends: 'div' });
}

/**
 * Custom element representing a match history list. Used for the game history profile tab.
 * Displays a header and a list of InlineMatch elements.
 * Extends HTMLDivElement.
 */
export class MatchHistory extends HTMLDivElement {
    constructor() {
        super();
    }

    /**
     * Populates the match history with a header and InlineMatch elements for each match.
     * @param matches - Array of match outcome data.
     */
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
