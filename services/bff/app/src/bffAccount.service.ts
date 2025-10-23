import type { ProfileCreationResult } from "./bff.interface.js";

//TODO I dont send the parameter in the fetch there ??
//TODO change to smart route
export async function validateCredentials(username: string, password: string): Promise<Response | null> {
	const response = await fetch(`http://account:1414/internal/account/login`);
	if (response.status === 401)
		return (null)
	if (!response.ok)
		throw (new Error('Users service failed. Please try again later'));
	return (response.json() as Promise<Response>);
}

//TODO change to smart route
async function updateAccountUsername(userID: string, newUsername: string): Promise<Response> {
	const url = `http://account:1414/internal/account/${userID}/username`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: newUsername })
	});
}

//TODO change to smart route
async function updateUserProfileUsername(userID: string, newUsername: string): Promise<Response> {
	const url = `http://users:2626/internal/users/${userID}/username`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: newUsername })
	});
}

export async function updateUsername(log: any, userID: number, newUsername: string): Promise<void> {
	const userIDStr = String(userID);
	let accountResponse: Response;
	let profileResponse: Response;

	try {
		[accountResponse, profileResponse] = await Promise.all([
			updateAccountUsername(userIDStr, newUsername),
			updateUserProfileUsername(userIDStr, newUsername)
		]);
	} catch (error) {
		throw new Error('A backend service is unreachable.');
	}
	if (accountResponse.status === 409) {
		const errorBody = await accountResponse.json() as { message: string };
		throw { code: 409, message: errorBody.message || 'Username is already taken.' };
	}
	if (profileResponse.status === 409) {
		const errorBody = await profileResponse.json() as { message: string };
		throw { code: 409, message: errorBody.message || 'Username is already taken.' };
	}

	if (accountResponse.status === 404 || profileResponse.status === 404) {
		log.error(`[BFF] Data inconsistency: User ${userID} not found in one or more services.`);
		throw new Error('User data is inconsistent; update failed.');
	}

	if (!accountResponse.ok || !profileResponse.ok) {
		log.error(`[BFF] A backend service returned an unexpected non-OK status.`);
		throw new Error('An unexpected error occurred in a backend service.');
	}
	return;
}

export async function updatePassword(log: any, userID: number, newHashedPassword: string): Promise<void> {
	const url = `http://account:1414/internal/account/${userID}/password`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ newHashedPassword: newHashedPassword })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service reported a validation error for user ${userID}`);
		throw new Error('User validation failed.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for new password update: ${userID}`);
		throw new Error('User not found in profile service.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return;
}

//TODO change to smart route
export async function createAccount(username: string, hashedPassword: string): Promise<{ userID: number } | null> {
	const response = await fetch('https://account:1414/internal/account/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: username, password: hashedPassword })
	});
	if (response.status === 409)
		return (null);
	if (!response.ok)
		throw (new Error('Account service failed. Please try again later'));
	return (response.json() as Promise<{ userID: number }>);
}

//TODO change to smart route
export async function createUserProfile(userID: number, username: string): Promise<ProfileCreationResult> {
	const response = await fetch(`https://users:2626/internal/users/${userID}/profile`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: username })
	});

	if (response.status === 409)
		return { errorCode: 'conflict' };
	if (response.status === 404)
		return { errorCode: 'user_not_found' };
	if (!response.ok)
		throw new Error(`Profile service failed with status ${response.status}`);
	const data = await response.json();
	return { errorCode: 'success', data: data };
}

//TODO change to smart route
export async function deleteAccount(userID: number): Promise<Response | null> {
	const response = await fetch(`https://account:1414/internal/account`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userID: userID })
	});
	if (response.status === 404)
		return (null);
	return (response.json() as Promise<Response>);
}

//TODO change to smart route
export async function deleteUser(userID: number): Promise<Response | null> {
	const response = await fetch(`http://users:2626/internal/users/${userID}`, { method: 'DELETE' });
	if (!response.ok)
		return (null);
	return (response.json() as Promise<Response>);
}

//TODO change to smart route
export async function deleteFriendship(userID: number): Promise<Response | null> {
	const response = await fetch(`http://friends:1616/internal/friends/${userID}/friendships`, { method: 'DELETE' });
	if (!response.ok)
		return (null);
	return (response.json() as Promise<Response>);
}

export async function updateBio(log: any, userID: number, bio: string): Promise<void> {
	const url = `http://account:1414/internal/users/${userID}/bio`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ bio: bio })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service reported a validation error for user ${userID}`);
		throw new Error('User validation failed.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for bio update: ${userID}`);
		throw new Error('User not found in profile service.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return;
}

export async function updateProfileColor(log: any, userID: number, profileColor: string): Promise<void> {
	const url = `http://account:1414/internal/users/${userID}/profileColor`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ profileColor: profileColor })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service reported a validation error for user ${userID}`);
		throw new Error('User validation failed.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for profileColor update: ${userID}`);
		throw new Error('User not found in profile service.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return;
}

export async function updateDefaultLang(log: any, userID: number, defaultLang: string): Promise<void> {
	const url = `https://users:2626/internal/account/${userID}/defaultLang`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ defaultLang: defaultLang })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service reported a validation error for user ${userID}`);
		throw new Error('User validation failed.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for defaultLang update: ${userID}`);
		throw new Error('User not found in profile service.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return;
}

export async function updateAvatar(log: any, userID: number, avatar: string): Promise<void> {
	const url = `https://users:2626/internal/users/${userID}/avatar`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ avatar: avatar })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service reported a validation error for user ${userID}`);
		throw new Error('User validation failed.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for avatar update: ${userID}`);
		throw new Error('User not found in profile service.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return;
}

