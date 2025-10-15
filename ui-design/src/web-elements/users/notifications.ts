import type { buttonData, GameType } from '../../types-interfaces';
import { createMenu } from '../navigation/helpers';

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
class NotifContent extends HTMLDivElement {
    #text: HTMLParagraphElement;
    constructor() {
        super();
        this.#text = document.createElement('p');
        const buttons = createMenu(notificationBtns, 'horizontal', 's');
        this.appendChild(this.#text);
        this.appendChild(buttons);
    }

    set notifContent(str: string) {
        this.#text.innerText = str;
    }

    connectedCallback() {
        this.className = 'grid grid-cols-[65%_32%] gap-xs';
        this.id = 'notification';
        this.setAttribute('unread', '');
    }
}

customElements.define('notif-content', NotifContent, { extends: 'div' });

class NotifToggle extends HTMLDivElement {
    #alert: HTMLDivElement;

    constructor() {
        super();
        this.#alert = document.createElement('div');
    }

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

    toggleAlert(hasUnread: boolean) {
        if (hasUnread) this.#alert.classList.remove('hidden');
        else this.#alert.classList.add('hidden');
    }

    connectedCallback() {
        this.#createToggleContent();
    }
}

customElements.define('notif-toggle', NotifToggle, { extends: 'div' });

class NotifPanel extends HTMLDivElement {
    #content: HTMLDivElement;

    static get observedAttributes(): string[] {
        return ['selected'];
    }

    constructor() {
        super();
        this.id = 'notifPopup';
        this.className = 'hidden fixed';
        this.#content = document.createElement('div');
    }

    addDefault() {
        const defaultContent = document.createElement('p');
        defaultContent.innerText = 'No new notifications :<';
        defaultContent.id = 'default';
        this.#content.appendChild(defaultContent);
    }

    #createPopupContent() {
        this.#content.className =
            'border-box clear-bg brdr pad-s w-[fit-content] relative grid gap-s';

        const notifDecor = document.createElement('img');
        notifDecor.src = '/assets/icons/notification-bubble.png';
        notifDecor.className = 'h-[32px] w-[16px] absolute right-[-20px] top-[8px]';

        this.#content.appendChild(notifDecor);
        this.append(this.#content);
    }

    updateVisibility() {
        if (this.hasAttribute('selected')) this.removeAttribute('selected');
        else this.setAttribute('selected', '');
    }

    checkUnreadNotification(): boolean {
        let hasUnread: boolean = false;
        const list = Array.from(this.#content.children);
        list.forEach((item) => {
            if (item.hasAttribute('unread')) {
                hasUnread = true;
                return;
            }
        });
        return hasUnread;
    }

    clearStaleNotifications() {
        const list = Array.from(this.#content.children);
        list.forEach((item) => {
            if (item.hasAttribute('unread')) item.removeAttribute('unread');
        });
    }

    newNotification(el: NotifContent) {
		this.#content.querySelector('#default')?.remove();
        this.#content.insertBefore(el, this.#content.firstChild);
    }
    attributeChangedCallback() {
        this.clearStaleNotifications();
        this.classList.toggle('hidden');
    }

    connectedCallback() {
        this.#createPopupContent();
        this.addDefault();
    }
}

customElements.define('notif-panel', NotifPanel, { extends: 'div' });

export class Notification extends HTMLDivElement {
    #toggle: NotifToggle;
    #popup: NotifPanel;
    #newNotifIntervalId!: NodeJS.Timeout;

    constructor() {
        super();
        this.#toggle = document.createElement('div', { is: 'notif-toggle' }) as NotifToggle;
        this.#popup = document.createElement('div', { is: 'notif-panel' }) as NotifPanel;

        this.appendChild(this.#popup);
        this.appendChild(this.#toggle);

		this.id = 'notificationWrapper'
    }

    #computePanelPos() {
        const pos = this.#toggle.getBoundingClientRect();
        const popupWidth = this.#popup.offsetWidth;
        const pOffsetLeft = pos.left - (popupWidth + 16);
        const pOffsetTop = pos.top - 8;

        this.#popup.style.position = 'fixed';
        this.#popup.style.left = `${pOffsetLeft}px`;
        this.#popup.style.top = `${pOffsetTop}px`;
    }

    newFriendRequest(username: string) {
        const notif = document.createElement('div', { is: 'notif-content' }) as NotifContent;
        notif.notifContent = `${username} sent you a friend request!`;

        this.#popup.newNotification(notif);
        this.#computePanelPos();
    }

    newGameInvitation(username: string, game: GameType) {
        const notif = document.createElement('div', { is: 'notif-content' }) as NotifContent;
        notif.notifContent = `${username} challenged you to a ${game}!`;

        this.#popup.newNotification(notif);
        this.#computePanelPos();
    }
    connectedCallback() {
        this.#newNotifIntervalId = setInterval(() => {
            this.#toggle.toggleAlert(this.#popup.checkUnreadNotification());
        }, 5000);
        this.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as Element | null;
            if (target && target.matches('#notifToggle')) {
                this.#popup.updateVisibility();
                this.#popup.clearStaleNotifications();
                this.#toggle.toggleAlert(this.#popup.checkUnreadNotification());
                this.#computePanelPos();
            }
        });
        window.addEventListener('resize', this.#computePanelPos.bind(this));
        window.addEventListener('scroll', this.#computePanelPos.bind(this));
        this.render();
    }

    disconnectedCallback() {
        clearInterval(this.#newNotifIntervalId);
    }

    render() {
        this.className = 'relative box-border w-fit flex items-start gap-m';
    }
}

customElements.define('notification-container', Notification, { extends: 'div' });
