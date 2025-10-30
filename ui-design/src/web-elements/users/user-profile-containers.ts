import { createUserCardSocial } from './profile-helpers';
import type { UserData } from '../../types-interfaces';

export class UserMasonery extends HTMLDivElement {
    constructor() {
        super();
    }

    setUsers(users: UserData[]) {
        users.forEach((el) => {
            this.append(createUserCardSocial(el));
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = 'w-full masonery gap-xs';
    }
}

if (!customElements.get('user-masonery')) {
    customElements.define('user-masonery', UserMasonery, { extends: 'div' });
}
