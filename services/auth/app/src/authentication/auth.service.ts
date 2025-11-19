import type { ProfileCreationResult, UserAuth } from "./auth.interfaces.js";

export async function validateCredentials(log: any, username: string, hashedPassword: string): Promise<false | UserAuth> {
	let response: Response;
	const url = 'https://account:1414/internal/account/login';
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, hashedPassword }),
		});
	} catch (error) {
		log.error(`[AUTH] Account service (login) is unreachable: ${error}`);
		throw new Error('Account service is unreachable.');
	}

	if (response.status === 401) {
		log.warn(`[AUTH] Failed login attempt for user: ${username}`);
		return (false);
	}

	if (!response.ok) {
		log.error(`[AUTH] Account service (login) failed with status ${response.status}`);
		throw new Error('Account service failed.');
	}

	// TODO Parse response to ensure proper schema
	return await response.json() as UserAuth;
}


export async function createAccount(log: any, username: string, hashedPassword: string): Promise<{ userID: number }> {
	const url = `https://account:1414/internal/account/register`
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username, password: hashedPassword })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 409) {
		log.warn(`[BFF] Username already taken for account creation`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 409, message: errorBody.message || 'Username is already taken.' };
	}
	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return (response.json() as Promise<{ userID: number }>);
}

export async function createUserProfile(log: any, userID: number, username: string): Promise<ProfileCreationResult> {
	const url = `https://users:2626/internal/users/${userID}/profile`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}
	if (response.status === 409) {
		log.warn(`[BFF] Username already taken for profile creation`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 409, message: errorBody.message || 'Username is already taken.' };
	}
	if (!response.ok) {
		log.warn(`[BFF] Internal server error`);
		throw new Error(`Profile service failed with status ${response.status}`);
	}
	const data = await response.json();
	return { errorCode: 'success', data: data };
}

export async function deleteAccount(log: any, userID: number): Promise<void> {
	const url = `https://account:1414/internal/account`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userID: userID })
		});
	} catch (error) {
		log.error(`[BFF] Account service is unreachable: ${error}`);
		throw new Error('Account service is unreachable.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] Account not found account deletion: ${userID}`);
		const errorBody = await response.json() as { message: string };
		throw { code: 404, message: errorBody.message || 'Account not found.' };
	}

	if (!response.ok) {
		log.error(`[BFF] Account service failed with status ${response.status}`);
		throw new Error('Account service failed.');
	}

	return;
}
