import { createUserCardSocial, createUserInline } from './profile-helpers.js';
import type { TabData, UserData } from '../types-interfaces.js';
import { UserProfile } from './profile.js';
import { TabContainer } from '../navigation/tabs.js';
import { createTabs } from '../navigation/tabs-helpers.js';
import { profileTabs } from '../navigation/default-menus.js';
import { currentDictionary } from '../forms/language.js';

export const user: UserData = {
	avatar: {
		alt: 'pp',
		id: 'user-avatar',
		size: 'ixl',
		src: '/public/assets/images/magenta-avatar.png',
	},
	biography: '',
	id: '',
	relation: 'self',
	profileColor: '',
	language: '',
	status: true,
	username: '',
	winstreak: '',
	since: '',
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
		this.className = 'w-full h-full masonery gap-s pad-s';
	}
}

if (!customElements.get('user-masonery')) {
	customElements.define('user-masonery', UserMasonery, { extends: 'div' });
}

export class UserList extends HTMLDivElement {
	constructor() {
		super();
	}

	setUsers(users: UserData[]) {
		users.forEach((el) => {
			this.append(createUserInline(el));
		});
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.className = 'grid grid-flow-rows row-m gap-m pad-s h-full w-full';
	}
}

if (!customElements.get('user-list')) {
	customElements.define('user-list', UserList, { extends: 'div' });
}

export class ProfilePage extends HTMLDivElement {
	#userProfile: UserProfile;
	#userTabs: TabContainer;

    constructor() {
        super();
        this.#userProfile = document.createElement('div', { is: 'user-profile' }) as UserProfile;
        this.#userTabs = createTabs(profileTabs(currentDictionary));
    }

	set profile(user: UserData) {
		this.#userProfile.userInfo = user;
	}

	/**Takes a {@link TabData} in parameter. It auto-determines if the `id` of 
    the provided tabData matches one of the current tab for the Tab container.
	
    If not, fails silently (for now, maybe I'll add an error management later)  */
	set panelContent(tabData: TabData | null) {
		if (!tabData) return;
		this.#userTabs.populatePanels(tabData);
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.append(this.#userProfile, this.#userTabs);
		this.id = 'user-profile';
		this.className =
			'bg content-h min-w-fit brdr overflow-y-auto overflow-x-hidden flex flex-col justify-start';
	}
}

if (!customElements.get('profile-page')) {
	customElements.define('profile-page', ProfilePage, { extends: 'div' });
}
