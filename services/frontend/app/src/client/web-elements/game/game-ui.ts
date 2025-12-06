class Scoreboard extends HTMLSpanElement {
	/**[0] is player 1; [1] is player 2 */
	#scoreVal: number[];
	#scoreUI: HTMLSpanElement[];

	constructor() {
		super();
		this.#scoreVal = [0, 0];
		this.#scoreUI = [];

		this.#scoreUI[0] = document.createElement('span');
		this.#scoreUI[1] = document.createElement('span');
	}

	set player1Score(p1: number) {
		this.#scoreVal[0] = p1;
		const strScore = this.#scoreVal[0].toString();
		if (strScore) this.#scoreUI[0].innerText = strScore;
	}

	set player2Score(p2: number) {
		this.#scoreVal[1] = p2;
		const strScore = this.#scoreVal[1].toString();
		if (strScore) this.#scoreUI[1].innerText = strScore;
	}

	get player1Score(): HTMLSpanElement {
		return this.#scoreUI[0];
	}

	get player2Score(): HTMLSpanElement {
		return this.#scoreUI[1];
	}

	connectedCallback() {
		this.render();
	}

	render() {
		const separator = document.createElement('span');
		separator.innerText = '|';
		this.append(this.#scoreUI[0], separator, this.#scoreUI[1]);
		this.className =
			'border-box flex place-content-between w-xxl pad-xs item-center bg-wood brdr f-bold f-yellow f-m';
		this.id = 'pongui';
	}
}

if (!customElements.get('score-board')) {
	customElements.define('score-board', Scoreboard, { extends: 'span' });
}

export class PongUI extends HTMLDivElement {
	/**[0] is player 1; [1] is player 2 */
	#players: HTMLSpanElement[];
	#scboard: Scoreboard;

	constructor() {
		super();
		this.#players = [];

		this.#players[0] = document.createElement('span');
		this.#players[1] = document.createElement('span');
		this.#scboard = document.createElement('span', { is: 'score-board' }) as Scoreboard;
		this.id = 'pongui';
	}

	/* -------------------------------------------------------------------------- */
	/*                              getters & setters                             */
	/* -------------------------------------------------------------------------- */

	get player1(): HTMLSpanElement {
		return this.#players[0];
	}

	get player2(): HTMLSpanElement {
		return this.#players[1];
	}

	set scoreboard(score: number[]) {
		this.#scboard.player1Score = score[0];
		this.#scboard.player2Score = score[1];
	}
	get scoreboard(): Scoreboard {
		return this.#scboard;
	}

	connectedCallback() {
		this.render();
	}

	styleUsernames() {
		this.#players.forEach((p) => {
			p.className = 'f-yellow f-l f-bold tiny-shadow';
		});
	}

	render() {
		this.append(this.#players[0], this.#scboard, this.#players[1]);
		this.styleUsernames();
		this.scoreboard = [0, 0];
		this.className = 'flex justify-self-center pc-w place-content-between items-center z-50';
	}
}

if (!customElements.get('pong-ui')) {
	customElements.define('pong-ui', PongUI, { extends: 'div' });
}
