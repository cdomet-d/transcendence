import { currentDictionary } from '../forms/language';
import { NotifContent } from './notification-content';
import { Listbox } from '../navigation/listbox';
import notifbell from '../../assets/images/notification.png'
import notifarrow from '../../assets/images/notification-bubble.png'

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
		notifIcon.src = notifbell;

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
export class NotifPanel extends Listbox {
	constructor() {
		super();
		this.id = 'notifPopup';
		this.className = 'fixed z-1 notif-panel-pos w-lg h-l box-border bg brdr pad-xs grid';
	}

	/** Builds the popup layout and attaches the default message. */
	override connectedCallback() {
		super.connectedCallback();
		this.#createPopupContent();
		this.addDefault();
	}

    /** Adds a default message when the list has no notifications. */
    addDefault() {
        const defaultContent = document.createElement('li');
        defaultContent.innerText = currentDictionary.notifs.notif_placeholder/* 'No new notifications :<' */;
        defaultContent.id = 'default';
        this.append(defaultContent);
    }

	/** Creates panel structure with background and decorative elements. */
	#createPopupContent() {
		const notifDecor = document.createElement('img');
		notifDecor.src = notifarrow;
		this.append(notifDecor);
		notifDecor.className = 'h-[32px] w-[16px] absolute right-[-20px] top-[4px]';
	}

	/**
	 * Checks for unread notifications in the panel.
	 *
	 * @returns {boolean} True if any item is marked as unread.
	 */
	checkUnreadNotification(): boolean {
		let hasUnread = false;
		const list = Array.from(this.children);
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
		super.arrayFromChildren();
		super.options.forEach((item) => {
			if (item.hasAttribute('unread')) item.removeAttribute('unread');
		});
	}

	/**
	 * Inserts a new notification at the top of the panel.
	 *
	 * @param {NotifContent} el - The notification element to add.
	 */
	newNotification(el: NotifContent) {
		this.querySelector('#default')?.remove();
		this.insertBefore(el, this.firstChild);
		el.setAttribute('unread', '');
		super.arrayFromChildren();
	}
}

if (!customElements.get('notif-panel')) {
	customElements.define('notif-panel', NotifPanel, { extends: 'ul' });
}
