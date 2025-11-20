import type { ProfileCreationResult, UserAuth } from "./auth.interfaces.js";
import { Database } from "sqlite";
import { Agent } from 'undici';

const sslAgent = new Agent({
	connect: {
		rejectUnauthorized: false
	}
});

export async function createUserProfile(log: any, userID: number, username: string): Promise<ProfileCreationResult> {
	const url = `https://nginx/api/users/${userID}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username }),
			dispatcher: sslAgent
		} as unknown as RequestInit);
	} catch (error) {
		log.error(`[AUTH] User service (via NGINX) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 409) {
		log.warn(`[AUTH] Username already taken for profile creation`);
		let message = 'Username is already taken.';
		try {
			const errorBody = (await response.json()) as { message: string };
			if (errorBody.message) message = errorBody.message;
		} catch (error) { }

		return { errorCode: 'conflict' };
	}

	if (!response.ok) {
		log.warn(`[AUTH] User service failed with status ${response.status}`);
		throw new Error(`Profile service failed with status ${response.status}`);
	}

	const data = await response.json();
	return { errorCode: 'success', data: data };
} 

export async function checkUsernameUnique(db: Database, username: string): Promise<boolean> {
	try {
		const query = `
			SELECT 1 FROM account WHERE username = ? LIMIT 1
		`;
		const response = await db.all(query, username);

		//true == username taken, false == username available
		return (response.length > 0);
	} catch (error) {
		console.log(4);

		console.log(`[AUTH] Error fetching username availability for  ${username}: `, error)
		throw (error);
	}
};

export async function deleteAccount(log: any, userID: number): Promise<void> {
	const url = `http://account:1414/internal/account`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userID: userID })
		});
	} catch (error) {
		log.error(`[AUTH] Account service is unreachable: ${error}`);
		throw new Error('Account service is unreachable.');
	}

	if (response.status === 404) {
		log.warn(`[AUTH] Account not found account deletion: ${userID}`);
		const errorBody = await response.json() as { message: string };
		throw { code: 404, message: errorBody.message || 'Account not found.' };
	}

	if (!response.ok) {
		log.error(`[AUTH] Account service failed with status ${response.status}`);
		throw new Error('Account service failed.');
	}

	return;
}
