/**
 * Custom element for displaying a username with status.
 * Extends HTMLDivElement.
 * @remark in order to be able to update the user's status, the instance of each `Username` (or containing element) must be stored in some way.
 */
export class Username extends HTMLDivElement {
    #status: HTMLDivElement;
    #name: HTMLDivElement;
    #isLogged: boolean;

    /**
     * Initializes the username and status elements.
     * Sets initial logged status to false.
     */
    constructor() {
        super();
        this.#isLogged = false;
        this.#status = document.createElement('div');
        this.#name = document.createElement('div');
        this.appendChild(this.#name);
        this.appendChild(this.#status);
    }

    /**
     * Sets the username text.
     */
    set name(val: string) {
        this.#name.innerText = val;
    }

    /**
     * Updates the login status.
     * @param isLogged - Whether the user is logged in.
     */
    set updateStatus(isLogged: boolean) {
        this.#isLogged = isLogged;
    }

    /** Called when element is added to the document. */
    connectedCallback() {
        this.render();
    }

    /**
     * Sets up styles and updates status class.
     * Adds 'true' class if logged in, else 'false'. This toggles the color change.
     */
    render() {
        this.#status.className = 'user-status';
        this.className = 'f-yellow f-s grid gap-s username justify-items-center';
        if (this.#isLogged) {
            this.#status.classList.add('true');
        } else {
            this.#status.classList.add('false');
        }
    }
}

customElements.define('username-container', Username, { extends: 'div' });
