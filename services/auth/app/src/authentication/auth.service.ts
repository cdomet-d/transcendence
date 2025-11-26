import type { ProfileCreationResult, UserAuth } from "./auth.interfaces.js";
import { Database } from "sqlite";

export async function createUserProfile(log: any, userID: number, username: string): Promise<ProfileCreationResult> {
	const url = `http://nginx:80/api/users/${userID}`;

	const body = JSON.stringify({ username: username });
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username }),
		});
	} catch (error) {
		log.error(`[AUTH] User service (via NGINX) is unreachable: ${error}`);
		throw new Error(`Profile service failed with status`);
;
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
		console.log(`[AUTH] Error fetching username availability for  ${username}: `, error)
		throw (error);
	}
};

export async function deleteAccount(db: Database, log: any, userID: number): Promise<boolean> {

	try {
		const query = `DELETE FROM account WHERE userID = ?`;

		const result = await db.run(query, [userID]);
		if (!result.changes)
			return (false)
		return (true);
	} catch (error) {
		log.error(`[AUTH] Error deleting account: ${error}`);
		return (false);
	}
};
