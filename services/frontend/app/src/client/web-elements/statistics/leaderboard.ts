import type { UserData } from '../types-interfaces.js';
import { UserList } from '../users/user-profile-containers.js';

export class Leaderboard extends HTMLDivElement {
    #data: UserData[];
    #users: UserList;
    constructor() {
        super();
        this.#data = [];
        this.#users = createUserList(this.#data);
        this.append(this.#users);
    }

    set data(newData: UserData[]) {
        this.#data = newData;
    }

    update() {
        this.#users.remove();
        this.#users = createUserList(this.#data);
        this.append(this.#users);
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

export function createUserList(users: UserData[]): UserList {
    const el = document.createElement('div', { is: 'user-list' }) as UserList;
    el.setUsers(users);
    return el;
}

export function createLeaderboard(data: UserData[]): Leaderboard {
    const el = document.createElement('div', { is: 'leader-board' }) as Leaderboard;
    el.data = data;
    return el;
}
