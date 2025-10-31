import type { MatchParticipants } from '../types-interfaces';
import { UserInline } from '../users/profile';

/**
 * Custom element representing a single match in the tournament bracket.
 * Displays two players using UserInline elements.
 * Extends HTMLDivElement.
 */
export class Match extends HTMLDivElement {
    #player1: UserInline;
    #player2: UserInline;
    #players: MatchParticipants | null;

    /**
     * Initializes the match element with two player slots.
     */
    constructor() {
        super();
        this.#player1 = document.createElement('div', { is: 'user-inline' }) as UserInline;
        this.#player2 = document.createElement('div', { is: 'user-inline' }) as UserInline;
        this.#players = null;
    }

    /**
     * Sets the players for the match and updates the player elements.
     * @param players - The participants for this match.
     */
    set players(players: MatchParticipants) {
        this.#players = players;
        this.#player1.userInfo = this.#players.player1;
        this.#player2.userInfo = this.#players.player2;
    }

    /**
     * Sets the bracket ID for this match element.
     * @param bid - The bracket ID.
     */
    set bracketId(bid: string) {
        this.id = bid;
    }

    connectedCallback() {
        this.render();
    }
    render() {
        this.append(this.#player1, this.#player2);
        this.className = 'grid gap-s h-[112px]';
    }
}

if (!customElements.get('t-match')) {
    customElements.define('t-match', Match, { extends: 'div' });
}

/**
 * Custom element for drawing bracket connectors using a canvas.
 * Extends HTMLCanvasElement.
 */
export class BracketConnectors extends HTMLCanvasElement {
    constructor() {
        super();
    }
}

if (!customElements.get('t-canva')) {
    customElements.define('t-canva', BracketConnectors, { extends: 'canvas' });
}

//TODO: handle tournament bracket connection

/**
 * Custom element representing the tournament brackets.
 * Manages rounds, matches, and player assignments.
 * Extends HTMLDivElement.
 */
export class TournamentBrackets extends HTMLDivElement {
    #matches: Match[][];
    #players: MatchParticipants[];
    #gamePerRound: number;
    #totalRounds: number;
    #currentRound: number;
    #span: number;

    /**
     * Initializes the tournament brackets element.
     */
    constructor() {
        super();
        this.#matches = [];
        this.#players = [];
        this.#gamePerRound = 0;
        this.#totalRounds = 1;
        this.#currentRound = 1;
        this.#span = 1;
    }

    /**
     * Computes the total number of rounds based on the number of players.
     * @private
     */
    #computeTotalRounds() {
        for (let firstRound = this.#players.length; firstRound !== 2; firstRound = firstRound / 2) {
            this.#totalRounds++;
        }
        this.#totalRounds += 1;
    }

    /**
     * Sets the players for the tournament and updates internal state.
     * @param players - Array of match participants.
     */
    set players(players: MatchParticipants[]) {
        this.#players = players;
    }

    /**
     * Initializes the matches for the current round and appends them to the bracket.
     * @private
     */
    #initMatches() {
        let row = 1;
        for (let i = 1; i <= this.#gamePerRound; i++) {
            if (!this.#matches[this.#currentRound - 1]) this.#matches[this.#currentRound - 1] = [];
            const match = document.createElement('div', { is: 't-match' }) as Match;
            this.#matches[this.#currentRound - 1][i - 1] = match;
            this.append(match);
            match.classList.add(
                `col-start-${this.#currentRound}`,
                `col-span-1`,
                `row-span-${this.#span}`,
                `row-start-${row}`,
            );
            match.bracketId = 'tournament-match';
            row += this.#span;
        }
        this.#currentRound++;
        this.#span *= 2;
    }
    //TODO: disable looser from previous bracket
    //TODO: need to make sure that the elemnt has been attached and everything before accessing the cache I guess ? It doesn't crash but it doesn't work if it's not attached.
    /**
     * Populates the brackets with player data for each match.
     * Can be called externally to populate the next round with the finished round's winners.
     * @param players - Array of match participants.
     */
    populateBrackets(players: MatchParticipants[]) {
        const matchNb = players.length;
        let playerIndex = 0;

        for (let i = 0; i <= this.#matches.length; i++) {
            if (this.#matches[i] && matchNb === this.#matches[i].length) {
                this.#matches[i].forEach((m) => {
                    m.players = players[playerIndex];
                    playerIndex++;
                });
            }
        }
    }

    /**
     * Called when the element is added to the document.
     * Initializes matches and renders the brackets.
     */
    connectedCallback() {
        this.#gamePerRound = this.#players.length;
        for (; this.#gamePerRound >= 1; this.#gamePerRound /= 2) this.#initMatches();
        this.render();
    }

    /**
     * Renders the tournament brackets, computes rounds, and populates matches.
     */
    render() {
        this.#computeTotalRounds();
        this.className = `grid grid-rows-${this.#players.length} grid-col-${
            this.#totalRounds
        } pad-xs v-gap-l place-items-center`;
        this.id = 'tournament-brackets';
        this.populateBrackets(this.#players);
    }
}
if (!customElements.get('tournament-bracket')) {
    customElements.define('tournament-bracket', TournamentBrackets, { extends: 'div' });
}
