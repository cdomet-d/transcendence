import { createMatchHistory, createMatchOutcome, InlineMatch, MatchHistory } from './matches.js';
import type { MatchOutcome } from '../types-interfaces.js';

const emptyMatch: MatchOutcome = {
    date: '',
    opponent: '',
    outcome: '',
    score: '',
    duration: '',
    tournament: true,
};

export class Leaderboard extends HTMLDivElement {
    #data: MatchOutcome[];
    #matches: MatchHistory;
    #header: InlineMatch;
    constructor() {
        super();
        this.#data = [];
        this.#matches = createMatchHistory(this.#data);
        this.#header = createMatchOutcome(emptyMatch, true);
        this.append(this.#header, this.#matches);
    }

    set data(newData: MatchOutcome[]) {
        this.#data = newData;
    }

    update() {
        console.log('UPDATE LEADERBOARD');
        this.#matches.remove();
        this.#matches = createMatchHistory(this.#data);
        this.append(this.#matches);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.id = 'leaderboard';
        this.className =
            'bg content-h brdr overflow-y-auto overflow-x-hidden flex flex-col justify-start';
    }
}

if (!customElements.get('leader-board')) {
    customElements.define('leader-board', Leaderboard, { extends: 'div' });
}

export function createLeaderboard(data: MatchOutcome[]): Leaderboard {
    const el = document.createElement('div', { is: 'leader-board' }) as Leaderboard;
    el.data = data;
    return el;
}
