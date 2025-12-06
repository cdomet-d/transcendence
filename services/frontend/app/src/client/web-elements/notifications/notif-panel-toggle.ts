import { NotifContent } from './notification-content';

/**
 * Represents a clickable notification icon toggle.
 *
 * @remarks
 * Displays a notification bell icon and a red alert dot when unread notifications exist.
 * Used by {@link Notification} to toggle visibility of {@link NotifPanel}.
 */
export class NotifToggle extends HTMLDivElement {
	#alert: HTMLDivElement;

	constructor() {
		super();
		this.#alert = document.createElement('div');
	}

	/**
	 * Toggles the alert visibility depending on unread notifications.
	 *
	 * @param {boolean} hasUnread - Indicates whether unread items exist.
	 */
	toggleAlert(hasUnread: boolean) {
		if (hasUnread) this.#alert.classList.remove('hidden');
		else this.#alert.classList.add('hidden');
	}

	connectedCallback() {
		this.#render();
	}
	/** Creates and assembles the toggle icon and the alert indicator. */
	#render() {
		const notifIcon = document.createElement('img');
		notifIcon.src = '../public/assets/images/notification.png';

		notifIcon.className = 'imedium isize z-1';
		notifIcon.id = 'notifToggle';
		this.#alert.id = 'notifAlert';

		this.#alert.className = 'hidden z-2 invalid thin brdr bg-red w-[8px] h-[8px] absolute top-[8px] right-[8px]';
		this.className = 'relative cursor-pointer hover:scale-108 transform transition-transform';

		this.append(notifIcon, this.#alert);
	}
}

if (!customElements.get('notif-toggle')) {
	customElements.define('notif-toggle', NotifToggle, { extends: 'div' });
}

/**
 * Represents the notification panel popup that lists all notifications.
 *
 * @remarks
 * Manages the display, addition, and clearing of notification elements.
 * Observes the `selected` attribute to toggle visibility.
 */
export class NotifPanel extends HTMLDivElement {
	#content: HTMLDivElement;
	#currentFocus: number;
	#notificationList: HTMLElement[];

	/** Observed attributes trigger UI updates when changed. */
	static get observedAttributes(): string[] {
		return ['selected'];
	}

	constructor() {
		super();
		this.id = 'notifPopup';
		this.className = 'hidden z-1 notif-panel-pos w-lg';
		this.#content = document.createElement('div');
		this.append(this.#content);
		this.#notificationList = []
	}

	/** Adds a default message when the list has no notifications. */
	addDefault() {
		const defaultContent = document.createElement('p');
		defaultContent.innerText = 'No new notifications :<';
		defaultContent.id = 'default';
		this.#content.append(defaultContent);
	}

	/** Creates panel structure with background and decorative elements. */
	#createPopupContent() {
		this.#content.className = 'box-border bg brdr pad-xs relative grid';

		const notifDecor = document.createElement('img');
		notifDecor.src = '/public/assets/images/notification-bubble.png';
		this.#content.append(notifDecor);
		notifDecor.className = 'h-[32px] w-[16px] absolute right-[-20px] top-[4px]';
	}

	hide() {
		this.classList.add('hidden');
		this.setAttribute('hidden', '')
	}

	/** Toggles the panel's visible state by switching its `selected` attribute. */
	updateVisibility() {
		try {
			if (this.hasAttribute('selected')) {
				this.removeAttribute('selected');
			} else {
				this.setAttribute('selected', '');
			}
		} catch (error) {
			console.error('Failed to toggle visibility:', error);
		}
	}

	/**
	 * Used by the `'keydown'` handler to calculate where the user is in the menu's option, remaining within the bounds of the options.
	 * @param {number} delta - the incrementing step; it's worth `-1` on `ArrowUp` and `1` on `ArrowDown`
	 */
	#moveFocus(delta: number) {
		this.#currentFocus =
			(this.#currentFocus + delta + this.#listboxOptions.length) %
			this.#listboxOptions.length;
		const focusedOption = this.#listboxOptions[this.#currentFocus];
		if (focusedOption) focusedOption.focus();
	}

	/** Responds to observed attribute changes to toggle visibility and clear old markers. */
	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		if (oldValue === newValue) return;

		this.clearStaleNotifications();

		if (name === 'selected') {
			if (this.hasAttribute('selected')) {
				this.classList.remove('hidden');
				this.removeAttribute('hidden');
				this.#notificationList[0].focus();
			} else this.hide();
		}
	}

	/**
	 * Checks for unread notifications in the panel.
	 *
	 * @returns {boolean} True if any item is marked as unread.
	 */
	checkUnreadNotification(): boolean {
		let hasUnread = false;
		const list = Array.from(this.#content.children);
		list.forEach((item) => {
			if (item.hasAttribute('unread')) {
				hasUnread = true;
				return;
			}
		});
		return hasUnread;
	}

	/** Removes 'unread' status from all notifications in the panel. */
	clearStaleNotifications() {
		const list = Array.from(this.#content.children);
		list.forEach((item) => {
			if (item.hasAttribute('unread')) item.removeAttribute('unread');
		});
	}

	/**
	 * Inserts a new notification at the top of the panel.
	 *
	 * @param {NotifContent} el - The notification element to add.
	 */
	newNotification(el: NotifContent) {
		this.#content.querySelector('#default')?.remove();
		this.#content.insertBefore(el, this.#content.firstChild);
		el.setAttribute('unread', '');
		this.#notificationList = Array.from(this.#content.children) as HTMLElement[];
	}

	/** Builds the popup layout and attaches the default message. */
	connectedCallback() {
		this.#createPopupContent();
		this.addDefault();
	}
}

if (!customElements.get('notif-panel')) {
	customElements.define('notif-panel', NotifPanel, { extends: 'div' });
}
