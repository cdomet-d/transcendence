import type { matchParticipants } from '../../types-interfaces';
import { UserInline } from '../users/profile';

export class TournamentMatchup extends HTMLDivElement {
    #player1: UserInline;
    #player2: UserInline;
    #players: matchParticipants;

    constructor() {
        super();
        this.#player1 = document.createElement('div', { is: 'user-inline' }) as UserInline;
        this.#player2 = document.createElement('div', { is: 'user-inline' }) as UserInline;
        this.#players = {
            player1: {
                avatar: {
                    alt: '',
                    id: 'user-avatar',
                    size: 'iicon',
                    src: '',
                },
                biography: '',
                id: '',
                relation: 'stranger',
                profileColor: '',
                language: '',
                status: false,
                username: '',
                winstreak: '',
                since: '',
            },
            player2: {
                avatar: {
                    alt: '',
                    id: 'user-avatar',
                    size: 'iicon',
                    src: '.png',
                },
                biography: '>:)',
                id: '',
                relation: 'stranger',
                profileColor: '',
                language: '',
                status: false,
                username: '',
                winstreak: '',
                since: '',
            },
        };
    }

    set players(players: matchParticipants) {
        this.#players = players;
        this.#player1.userInfo = this.#players.player1;
        this.#player2.userInfo = this.#players.player2;
    }

    set bracketId(bid: string) {
        this.id = bid;
    }

    connectedCallback() {
        this.render();
    }
    render() {
        this.append(this.#player1, this.#player2);
        this.className = 'grid gap-xs pr-4 border-r-4 h-[112px]';
    }
}

if (!customElements.get('tournament-pair')) {
    customElements.define('tournament-pair', TournamentMatchup, { extends: 'div' });
}

export class TournamentBrackets extends HTMLDivElement {
    #matches: TournamentMatchup[];
    #players: matchParticipants[];
    #gamePerRound: number;
    #totalRounds: number;
    #currentRound: number;

    constructor() {
        super();
        this.#matches = [];
        this.#players = [];
        this.#gamePerRound = 0;
        this.#totalRounds = 1;
        this.#currentRound = 1;
    }

    #computeTotalRounds() {
        for (let firstRound = this.#players.length; firstRound !== 2; firstRound = firstRound / 2) {
            this.#totalRounds++;
        }
        this.#totalRounds += 1;
    }
    set players(players: matchParticipants[]) {
        this.#players = players;
        this.#gamePerRound = players.length;
        this.#computeTotalRounds();
    }

    #initMatches() {
        if (this.#gamePerRound === this.#players.length) {
            let i: number = 1;
            this.#players.forEach((user) => {
                const match = document.createElement('div', {
                    is: 'tournament-pair',
                }) as TournamentMatchup;
                match.players = user;
                match.bracketId = 'r1-' + i.toString();
                this.#matches[i] = match;
                this.append(match);
                match.classList.add(
                    `col-start-${this.#currentRound}`,
                    `col-span-1`,
                    `row-start-${i}`
                );
                i++;
            });
        } else {
            for (let i = 1; i <= this.#gamePerRound; i++) {
                const match = document.createElement('div', {
                    is: 'tournament-pair',
                }) as TournamentMatchup;
                match.bracketId = i.toString();
                this.append(match);
                let span = this.#currentRound;
                if (this.#gamePerRound === 1) span = this.#players.length;
                let step = i;
                if (i !== 1) step = i + this.#gamePerRound - 1;
                match.classList.add(
                    `col-start-${this.#currentRound}`,
                    `col-span-1`,
                    `row-span-${span}`,
                    `row-start-${step}`
                );
            }
        }
        this.#currentRound++;
    }

    connectedCallback() {
        for (; this.#gamePerRound >= 1; this.#gamePerRound /= 2) this.#initMatches();
        this.render();
    }
    render() {
        this.className = `bg grid grid-rows-${this.#players.length} grid-col-${
            this.#totalRounds
        } pad-s gap-m place-items-center`;
        this.id = 'tournament-brackets';
    }
}
if (!customElements.get('tournament-bracket')) {
    customElements.define('tournament-bracket', TournamentBrackets, { extends: 'div' });
}
