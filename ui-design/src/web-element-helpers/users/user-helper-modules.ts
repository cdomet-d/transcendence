import { Username } from "../../web-elements/users/user-atoms";

/**
 * Creates a custom `Username` element displaying specified name and status.
 *
 * @param username - The username text to assign to the element.
 * @param status - The status value to set on the element. Allows to change the color of the token next to the username.
 * @returns A `Username` element with the given name and status set.
 */
export function createUsernameDiv(username: string, status: boolean): Username {
	const el = document.createElement('div', {is: 'username-container'}) as Username;
	el.name = username;
	el.updateStatus = status;
	return el;
}