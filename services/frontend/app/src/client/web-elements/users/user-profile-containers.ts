import { createUserCardSocial } from './profile-helpers.js';
import type { UserData } from '../types-interfaces.js';

/**
 * Custom element for displaying a masonry grid of user cards.
 * Each card is a UserCardSocial element.
 * Extends HTMLDivElement.
 */
export class UserMasonery extends HTMLDivElement {
    constructor() {
        super();
    }

    /**
     * Populates the masonry grid with user cards.
     * @param users - Array of user data objects.
     */
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
