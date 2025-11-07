import { createUserCardSocial, createUserProfile } from './profile-helpers.js';
import type { TabData, UserData } from '../types-interfaces.js';
import { UserProfile } from './profile.js';
import { TabContainer } from '../navigation/tabs.js';
import { createTabs } from '../navigation/tabs-helpers.js';
import { profileTabs } from '../navigation/default-menus.js';

export const user: UserData = {
    avatar: {
        alt: 'pp',
        id: 'user-avatar',
        size: 'ilarge',
        src: '/public/assets/images/magenta-avatar.png',
    },
    biography: '(╯°□°)╯︵ ┻━┻',
    id: '64',
    relation: 'stranger',
    profileColor: 'bg-BE5103',
    language: 'English',
    status: true,
    username: 'Elaine',
    winstreak: '7',
    since: '145',
};

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

export class ProfileWithTabs extends HTMLDivElement {
    #userProfile: UserProfile;
    #userTabs: TabContainer;

    constructor() {
        super();
        this.#userProfile = createUserProfile(user);
        this.#userTabs = createTabs(profileTabs);
    }

    set profile(user: UserData) {
        console.log('for user: ', user.id, 'view:', user.relation);
        this.#userProfile.userInfo = user;
    }

    /**Takes a {@link TabData} in parameter. It auto-determines if the `id` of 
	the provided tabData matches one of the current tab for the Tab container.
	
	If not, fails silently (for now, maybe I'll add an error management later)  */
    set panelContent(tabData: TabData) {
        this.#userTabs.populatePanels(tabData);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.append(this.#userProfile, this.#userTabs);
        this.id = 'user-profile';
        this.className =
            'bg content-h brdr overflow-y-auto overflow-x-hidden flex flex-col justify-start';
    }
}

if (!customElements.get('profile-page')) {
    customElements.define('profile-page', ProfileWithTabs, { extends: 'div' });
}
