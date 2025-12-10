import type { NavigationLinks } from '../navigation/links.js';
import type { MatchOutcome, NavigationLinksData } from '../types-interfaces.js';

const emptyMatch: MatchOutcome = {
	date: '',
	opponent: '',
	outcome: '',
	score: '',
	duration: '',
	tournament: true,
};

/**
 * Creates an InlineMatch element and populates it with match outcome data.
 * @param match - The match outcome data.
 * @returns {InlineMatch} The populated InlineMatch element.
 */
export function createMatchOutcome(match: MatchOutcome, header: boolean): InlineMatch {
	const el = document.createElement('div', { is: 'inline-match' }) as InlineMatch;
	el.match = match;
	header ? el.createHeader() : el.createSpans();
	return el;
}

/**
 * Creates a match history element and populates it with match data.
 *
 * @param {MatchOutcome[]} matches - Array of match outcome objects.
 * @returns {MatchHistory} A {@link MatchHistory} div element containing the match history.
 */
export function createMatchHistory(matches: MatchOutcome[]): MatchHistory {
	const el = document.createElement('div', { is: 'match-history' }) as MatchHistory;
	el.setHistory(matches);
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
		this.classList.add('bg-yellow', 'sticky', 'top-0', 'thin', 'brdr');
		this.id = 'matchesheader';
		return this;
	}

	//TODO: probably should add link to opponent profile
	/**
	 * Creates and appends spans for each match property value.
	 * @returns {InlineMatch} The InlineMatch element with value spans.
	 */
	createSpans(): InlineMatch {
		for (const key in this.#data) {
			let el;
			console.log(key);
			if (key === 'opponent' && this.#data[key] !== 'Unknown User') {
				const opponent = this.#data[key].toString();
				const opp: NavigationLinksData = {
					styleButton: false,
					id: 'opponent-link',
					datalink: opponent,
					href: `/user/${opponent}`,
					title: opponent,
					img: null,
				};
				el = document.createElement('a', { is: 'nav-link' }) as NavigationLinks;
				el.info = opp;
			} else el = document.createElement('span');
			this.append(el);
			el.id = key;
			if (key === 'tournament') {
				console.log('IS TOURNAMENT');
				el.textContent = this.#data[key as keyof MatchOutcome] ? 'Tournament' : '1vs1';
			} else el.textContent = this.#data[key as keyof MatchOutcome].toString();
		}
		this.id = 'match';
		return this;
	}

	connectedCallback() {
		this.render();
	}

	/**
	 * Renders the InlineMatch element with default styles.
	 */
	render() {
		this.classList.add('box-border', 'grid', 'grid-cols-6', 'h-m', 'text-center');
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
		const currentHistory = Array.from(this.children);
		if (currentHistory.length < 1) {
			this.append(createMatchOutcome(emptyMatch, true));
		} else {
			currentHistory.forEach((el) => {
				if (el.id !== 'matchesheader') el.remove();
			});
		}
		matches.forEach((el) => {
			this.append(createMatchOutcome(el, false));
		});
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.id = 'match-history';
		this.classList.add('grid', 'matches', 'grid-flow-rows', 'gap-xs', 'pad-s', 'h-full', 'w-full');
	}
}

if (!customElements.get('match-history')) {
	customElements.define('match-history', MatchHistory, { extends: 'div' });
}
