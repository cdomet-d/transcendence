import { Username, Winstreak, Biography } from './user-atoms.js';

/**
 * Creates a custom `Username` element displaying specified name and status.
 *
 * @param username - The username text to assign to the element.
 * @param status - The status value to set on the element. Allows to change the color of the token next to the username.
 * @returns A `Username` element with the given name and status set.
 */
export function createUsername(username: string, status: boolean): Username {
	const el = document.createElement('div', { is: 'username-container' }) as Username;
	el.name = username;
	el.status = status;
	return el;
}

export function createWinstreak(val: string): Winstreak {
	const el = document.createElement('span', { is: 'winstreak-block' }) as Winstreak;
	el.winstreakValue = val;
	return el;
}

export function createBiography(val: string): Biography {
	const el = document.createElement('p', { is: 'user-bio' }) as Biography;
	el.content = val;
	return el;
}
