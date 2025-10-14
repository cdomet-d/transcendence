export class Notification extends HTMLDivElement {
    #popup: HTMLDivElement;
    #toggle: HTMLDivElement;
    #alert: HTMLDivElement;

    static get observedAttributes(): string[] {
        return ['clicked'];
    }

    constructor() {
        super();
        this.#toggle = document.createElement('div');
        this.#popup = document.createElement('div');
        this.#alert = document.createElement('div');

        this.#popup.id = 'notifPopup';
        this.#popup.className = 'hidden fixed';
        this.#toggle.id = 'notifToggle';

        this.appendChild(this.#popup);
        this.appendChild(this.#toggle);
    }

    #createPopupContent() {
        const innerDiv = document.createElement('div');
        innerDiv.id = 'notifContent';
        innerDiv.className = 'clear-bg brdr pad-s w-[fit-content] relative';

        const notifDecor = document.createElement('img');
        notifDecor.src = '/assets/icons/notification-bubble.png';
        notifDecor.className = 'h-[32px] w-[16px] absolute right-[-20px] top-[8px]';

        const defaultContent = document.createElement('p');
        defaultContent.innerText = 'No new notifications :<';

        innerDiv.appendChild(defaultContent);
        innerDiv.appendChild(notifDecor);
        this.#popup.append(innerDiv);
    }

    #createToggleContent() {
        const notifIcon = document.createElement('img');
        notifIcon.src = '../assets/icons/notification.png';
        notifIcon.className = 'imedium isize z-1';

        this.#alert.id = 'notifAlert';
        this.#alert.className =
            'hidden z-2 invalid thin brdr red-bg w-xs h-xs absolute top-[8px] right-[8px]';

        this.#toggle.className =
            'w-[fit-content] relative cursor-pointer hover:scale-108 transform transition-transform';

        this.#toggle.appendChild(notifIcon);
        this.#toggle.appendChild(this.#alert);
    }

    togglePopup() {
        console.log('call to togglePopup');
        if (this.hasAttribute('clicked')) this.removeAttribute('clicked');
        else this.setAttribute('clicked', '');

        if (this.#popup.hasAttribute('selected')) this.#popup.removeAttribute('selected');
        else this.#popup.setAttribute('selected', '');

        const pos = this.#toggle.getBoundingClientRect();
        const popupWidth = this.#popup.offsetWidth;
        const pOffsetLeft = pos.left - (popupWidth + 16);
        const pOffsetTop = pos.top - 8;

        this.#popup.style.position = 'fixed';
        this.#popup.style.left = `${pOffsetLeft}px`;
        this.#popup.style.top = `${pOffsetTop}px`;

        if (this.#alert) {
            if (this.#alert.hasAttribute('selected')) this.#alert.removeAttribute('selected');
        }
        // this.attributeChangedCallback()
    }

    attributeChangedCallback() {
        console.log('call to attribute changed', this.#popup);
        if (this.#alert.hasAttribute('selected')) this.#alert.classList.remove('hidden');
        else this.#alert.classList.add('hidden');
        if (this.#popup.hasAttribute('selected')) this.#popup.classList.remove('hidden');
        else this.#popup.classList.add('hidden');
    }

    connectedCallback() {
        this.addEventListener('click', this.togglePopup.bind(this));
        this.render();
    }

    render() {
        console.log('Ye i was call ye');
        this.#createToggleContent();
        this.#createPopupContent();
        this.className = 'relative box-border w-fit flex items-start gap-m';
    }
}

customElements.define('notification-container', Notification, { extends: 'div' });
