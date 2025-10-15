import type { buttonData, GameType } from '../../types-interfaces';
import { createMenu } from '../navigation/helpers';

/**
 * Defines default button data used inside notifications (e.g., invitations).
 *
 * @remarks
 * Each button has a fixed `type`, `content`, accessibility `ariaLabel`, and display `style`.
 * Used by {@link NotifContent} to render Accept/Decline actions.
 */
const notificationBtns: Array<buttonData> = [
    {
        type: 'button',
        content: 'Decline',
        img: null,
        ariaLabel: 'Decline invitation',
        style: 'red',
    },
    {
        type: 'button',
        content: 'Accept',
        img: null,
        ariaLabel: 'Accept invitation',
        style: 'green',
    },
];

//TODO: determine if we want to keep notifications forever or delete them as the users "validates" them.
// - if we keep them: set a timeout on the menu to avoid the user attempting to reach a lobby that was closed
// - if we don't keep them: how do we decide that the user processed the notification ?

/**
 * Represents a single notification entry inside the panel.
 *
 * @remarks
 * Displays a short message and includes buttons created from {@link notificationBtns}.
 * The element is rendered as a grid with text and action buttons.
 */
class NotifContent extends HTMLDivElement {
    #text: HTMLParagraphElement;

    constructor() {
        super();
        this.#text = document.createElement('p');
    }

    /**
     * Sets the main text content for the notification message.
     *
     * @param {string} str - The message content shown to the user.
     */
    set setContent(str: string) {
        this.#text.innerText = str;
    }

    /** Called when the element is connected; renders text and buttons within the container. */
    connectedCallback() {
        const buttons = createMenu(notificationBtns, 'horizontal', 's');
        this.appendChild(this.#text);
        this.appendChild(buttons);
        this.className = 'grid grid-cols-[65%_32%] gap-xs';
        this.id = 'notification';
        this.setAttribute('unread', '');
    }
}

customElements.define('notif-content', NotifContent, { extends: 'div' });

/**
 * Represents a clickable notification icon toggle.
 *
 * @remarks
 * Displays a notification bell icon and a red alert dot when unread notifications exist.
 * Used by {@link Notification} to toggle visibility of {@link NotifPanel}.
 */
class NotifToggle extends HTMLDivElement {
    #alert: HTMLDivElement;

    constructor() {
        super();
        this.#alert = document.createElement('div');
    }

    /** Creates and assembles the toggle icon and the alert indicator. */
    #createToggleContent() {
        const notifIcon = document.createElement('img');
        notifIcon.src = '../assets/icons/notification.png';
        notifIcon.className = 'imedium isize z-1';
        notifIcon.id = 'notifToggle';

        this.#alert.id = 'notifAlert';
        this.#alert.className =
            'hidden z-2 invalid thin brdr red-bg w-xs h-xs absolute top-[8px] right-[8px]';

        this.className =
            'w-[fit-content] relative cursor-pointer hover:scale-108 transform transition-transform';

        this.appendChild(notifIcon);
        this.appendChild(this.#alert);
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

    /** Builds the inner elements when connected to the DOM. */
    connectedCallback() {
        this.#createToggleContent();
    }
}

customElements.define('notif-toggle', NotifToggle, { extends: 'div' });

/**
 * Represents the notification panel popup that lists all notifications.
 *
 * @remarks
 * Manages the display, addition, and clearing of notification elements.
 * Observes the `selected` attribute to toggle visibility.
 */
class NotifPanel extends HTMLDivElement {
    #content: HTMLDivElement;

    /** Observed attributes trigger UI updates when changed. */
    static get observedAttributes(): string[] {
        return ['selected'];
    }

    constructor() {
        super();
        this.id = 'notifPopup';
        this.className = 'hidden fixed';
        this.#content = document.createElement('div');
    }

    /** Adds a default message when the list has no notifications. */
    addDefault() {
        const defaultContent = document.createElement('p');
        defaultContent.innerText = 'No new notifications :<';
        defaultContent.id = 'default';
        this.#content.appendChild(defaultContent);
    }

    /** Creates panel structure with background and decorative elements. */
    #createPopupContent() {
        this.#content.className =
            'border-box clear-bg brdr pad-s w-[fit-content] relative grid gap-s';

        const notifDecor = document.createElement('img');
        notifDecor.src = '/assets/icons/notification-bubble.png';
        notifDecor.className = 'h-[32px] w-[16px] absolute right-[-20px] top-[8px]';

        this.#content.appendChild(notifDecor);
        this.append(this.#content);
    }

    /** Toggles the panel's visible state by switching its `selected` attribute. */
    updateVisibility() {
        if (this.hasAttribute('selected')) this.removeAttribute('selected');
        else this.setAttribute('selected', '');
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
    }

    /** Responds to observed attribute changes to toggle visibility and clear old markers. */
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        this.clearStaleNotifications();
        if (name === 'selected') this.classList.toggle('hidden');
    }

    /** Builds the popup layout and attaches the default message. */
    connectedCallback() {
        this.#createPopupContent();
        this.addDefault();
    }
}

customElements.define('notif-panel', NotifPanel, { extends: 'div' });

/**
 * Defines the 'notification-container' custom element, which displays user notifications.
 *
 * @remarks
 * Aggregates {@link NotifToggle}, {@link NotifPanel}, and {@link NotifContent} components.
 * Handles friend requests and game invitations.
 * Manages notification polling and interface updates on user interaction.
 */
export class Notification extends HTMLDivElement {
    #toggle: NotifToggle;
    #popup: NotifPanel;
    #newNotifIntervalId!: NodeJS.Timeout;

    constructor() {
        super();
        this.#toggle = document.createElement('div', { is: 'notif-toggle' }) as NotifToggle;
        this.#popup = document.createElement('div', { is: 'notif-panel' }) as NotifPanel;
        this.computePanelPos = this.computePanelPos.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    /** Computes and updates the position of the notification popup relative to the toggle button. */
    computePanelPos() {
        const pos = this.#toggle.getBoundingClientRect();
        const popupWidth = this.#popup.offsetWidth;
        const pOffsetLeft = pos.left - (popupWidth + 16);
        const pOffsetTop = pos.top - 8;

        this.#popup.style.position = 'fixed';
        this.#popup.style.left = `${pOffsetLeft}px`;
        this.#popup.style.top = `${pOffsetTop}px`;
    }

    /**
     * Creates and displays a new friend request notification.
     *
     * @param {string} username - The username who sent the friend request.
     */
    newFriendRequest(username: string) {
        const notif = document.createElement('div', { is: 'notif-content' }) as NotifContent;
        notif.setContent = `${username} sent you a friend request!`;
        this.#popup.newNotification(notif);
        this.computePanelPos();
    }

    /**
     * Creates and displays a new game invitation notification.
     *
     * @param {string} username - The user who sent the invitation.
     * @param {GameType} game - The type of game the user is invited to.
     */
    newGameInvitation(username: string, game: GameType) {
        const notif = document.createElement('div', { is: 'notif-content' }) as NotifContent;
        notif.setContent = `${username} challenged you to a ${game}!`;
        this.#popup.newNotification(notif);
        this.computePanelPos();
    }

    /**
     * Handles click events on the toggle icon, updating panel state and alert visibility.
     *
     * @param {MouseEvent} event - The triggered mouse event.
     */
    handleClick(event: MouseEvent) {
        const target = event.target as Element | null;
        if (target && target.matches('#notifToggle')) {
            this.#popup.updateVisibility();
            this.#popup.clearStaleNotifications();
            this.#toggle.toggleAlert(this.#popup.checkUnreadNotification());
            this.computePanelPos();
        }
    }

    //TODO: Improve notification polling with NATS messages when a user receives a notification
    /** Sets up event listeners and polling logic when the container is attached to the DOM. */
    connectedCallback() {
        this.#newNotifIntervalId = setInterval(() => {
            this.#toggle.toggleAlert(this.#popup.checkUnreadNotification());
        }, 5000);
        this.addEventListener('click', this.handleClick);
        window.addEventListener('resize', this.computePanelPos);
        window.addEventListener('scroll', this.computePanelPos);
        this.render();
    }

    /** Cleans up listeners and polling when the element is disconnected from the DOM. */
    disconnectedCallback() {
        clearInterval(this.#newNotifIntervalId);
        window.removeEventListener('resize', this.computePanelPos);
        window.removeEventListener('scroll', this.computePanelPos);
        this.removeEventListener('click', this.handleClick);
    }

    /** Renders the toggle and panel elements inside the main wrapper. */
    render() {
        this.appendChild(this.#toggle);
        this.appendChild(this.#popup);

        this.id = 'notificationWrapper';
        this.className = 'relative box-border w-fit flex items-start gap-m';
    }
}

customElements.define('notification-container', Notification, { extends: 'div' });
