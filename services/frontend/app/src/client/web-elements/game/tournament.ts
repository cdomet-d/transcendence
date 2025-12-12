import type { MatchParticipants } from '../types-interfaces.js';
import { createUserInline } from '../users/profile-helpers.js';
import { UserInline } from '../users/profile.js';

/**
 * Custom element representing a single match in the tournament bracket.
 * Displays two players using UserInline elements.
 * Extends HTMLDivElement.
 */
export class Match extends HTMLDivElement {
	#player1?: UserInline;
	#player2?: UserInline;
	#players: MatchParticipants | null;

	/**
	 * Initializes the match element with two player slots.
	 */
	constructor() {
		super();
		this.#players = null;
	}

	/**
	 * Sets the players for the match and updates the player elements.
	 * @param players - The participants for this match.
	 */
	set players(players: MatchParticipants) {
		this.#players = players;
		this.#player1 = createUserInline(this.#players.player1);
		this.#player2 = createUserInline(this.#players.player2);
		this.render();
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
		if (this.#player1 && this.#player2) {
			this.append(this.#player1, this.#player2);
			this.#player1.getUsername.link.classList.add('dead-link');
			this.#player2.getUsername.link.classList.add('dead-link');
		}
		this.className = 'grid brdr row-l';
	}
}

if (!customElements.get('t-match')) {
	customElements.define('t-match', Match, { extends: 'div' });
}

export class TournamentBrackets extends HTMLDivElement {
	#matches: MatchParticipants[];

	constructor() {
		super();
		this.#matches = [];
	}


	set matchesParticipants(matches: MatchParticipants[]) {
		this.#matches = matches;
	}

	connectedCallback() {
		this.render();
	}

	/**
	 * Renders the tournament brackets, computes rounds, and populates matches.
	 */
	render() {
		this.className = 'grid grid-flow-col grid-rows-2 grid-col-2 pad-s gap-l place-items-center bg brdr';
		this.#matches.forEach(el => {
			const m = document.createElement('div', { is: 't-match' }) as Match;
			m.players = el;
			this.append(m)
		})

		if (this.#matches.length === 3) {
			if (this.lastChild instanceof Match) {
				this.lastChild.classList.add('col-start-2', 'row-span-2')
			}
		}
	}
}
if (!customElements.get('tournament-bracket')) {
	customElements.define('tournament-bracket', TournamentBrackets, { extends: 'div' });
}