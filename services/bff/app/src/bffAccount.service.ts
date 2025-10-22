import type { ProfileCreationResult } from "./bff.interface.js";

export async function validateCredentials(username: string, password: string): Promise<Response | null> {
	const response = await fetch(`http://account:1414/internal/account/login`);
	if (response.status === 401)
		return (null)
	if (!response.ok)
		throw (new Error('Users service failed. Please try again later'));
	return (response.json() as Promise<Response>);
}

export async function updateAccountUsername(userID: number, newUsername: string): Promise<Response> {
	const url = `http://account:1414/internal/account/${userID}/username`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ newUsername })
	});
}

export async function updateAccountPassword(userID: number, newHashedPassword: string): Promise<Response> {
	const url = `http://account:1414/internal/account/${userID}/password`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ newHashedPassword })
	});
}

export async function updateUserProfileUsername(userID: number, newUsername: string): Promise<Response> {
	const url = `http://users:2626/internal/users/${userID}/username`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ newUsername })
	});
}

export async function createAccount(username: string, hashedPassword: string): Promise<{ userID: number } | null> {
	const response = await fetch('https://account:1414/internal/account/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, hashedPassword })
	});
	if (response.status === 409)
		return (null);
	if (!response.ok)
		throw (new Error('Account service failed. Please try again later'));
	return (response.json() as Promise<{ userID: number }>);
}

export async function createUserProfile(userID: number, username: string): Promise<ProfileCreationResult> {
	const response = await fetch(`https://users:2626/internal/users/${userID}/profile`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: username })
	});

	// Return a specific object for each known error case
	if (response.status === 409) {
		return { errorCode: 'conflict' };
	}
	if (response.status === 404) {
		return { errorCode: 'user_not_found' };
	}

	// Handle other unexpected server errors
	if (!response.ok) {
		throw new Error(`Profile service failed with status ${response.status}`);
	}

	// On success, return a success object with the data
	const data = await response.json();
	return { errorCode: 'success', data: data };
}