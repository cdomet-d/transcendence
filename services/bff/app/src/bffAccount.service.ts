import type { ProfileCreationResult, AccountData, AccountDataResponse, AccountDataBatchResponse } from "./bff.interface.js";
//THIS FILE IS DOOOOONE 
// GO FOCUS ON OTHER THINGS PLEASE

export async function validateCredentials(log: any, username: string, password: string): Promise<boolean> {
	let response: Response;
	const url = 'http://account:1414/internal/account/login';
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});
	} catch (error) {
		log.error(`[BFF] Account service (login) is unreachable: ${error}`);
		throw new Error('Account service is unreachable.');
	}

	if (response.status === 401) {
		log.warn(`[BFF] Failed login attempt for user: ${username}`);
		return (false);
	}

	if (!response.ok) {
		log.error(`[BFF] Account service (login) failed with status ${response.status}`);
		throw new Error('Account service failed.');
	}

	return (true);
}

async function updateAccountUsername(userID: string, newUsername: string): Promise<Response> {
	const url = `http://account:1414/internal/account/${userID}`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: newUsername })
	});
}

async function updateUserProfileUsername(userID: string, newUsername: string): Promise<Response> {
	const url = `http://users:2626/internal/users/${userID}`;
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
		throw new Error('A backend service is unreachable.'); }

	if (accountResponse.status === 409) {
		log.error(`[BFF] Username already taken, account not created in account service`)
		const errorBody = await accountResponse.json() as { message: string };
		throw { code: 409, message: errorBody.message || 'Username is already taken.' };
	}
	if (profileResponse.status === 409) {
		log.error(`[BFF] Username already taken, profile not created in user service`)
		const errorBody = await profileResponse.json() as { message: string };
		throw { code: 409, message: errorBody.message || 'Username is already taken.' };
	}

	if (accountResponse.status === 404 || profileResponse.status === 404) {
		log.error(`[BFF] Data inconsistency: User ${userID} not found in one or more services.`);
		const errorBody = await profileResponse.json() as { message: string };
		throw { code: 404, message: errorBody.message || 'Account/profile not found.' };
	}

	if (!accountResponse.ok || !profileResponse.ok) {
		log.error(`[BFF] A backend service returned an unexpected non-OK status.`);
		throw new Error('An unexpected error occurred in a backend service.');
	}
	return;
}

export async function updatePassword(log: any, userID: number, hashedPassword: string): Promise<void> {
	const url = `http://account:1414/internal/account/${userID}`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ hashedPassword: hashedPassword })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service reported a validation error for user ${userID}`);
		const errorBody = await response.json() as { message: string };
		throw { code: 409, message: errorBody.message || 'Bad Request.' };
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for new password update: ${userID}`);
		const errorBody = await response.json() as { message: string };
		throw { code: 404, message: errorBody.message || 'Account not found.' };
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return;
}

// export async function createAccount(log: any, username: string, hashedPassword: string): Promise<{ userID: number }> {
// 	const url = `http://account:1414/internal/account/register`
// 	let response: Response;
// 	try {
// 		response = await fetch(url, {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify({ username: username, password: hashedPassword })
// 		});
// 	} catch (error) {
// 		log.error(`[BFF] User service is unreachable: ${error}`);
// 		throw new Error('User service is unreachable.');
// 	}

// 	if (response.status === 409) {
// 		log.warn(`[BFF] Username already taken for account creation`);
// 		const errorBody = (await response.json()) as { message: string };
// 		throw { code: 409, message: errorBody.message || 'Username is already taken.' };
// 	}
// 	if (!response.ok) {
// 		log.error(`[BFF] User service failed with status ${response.status}`);
// 		throw new Error('User service failed.');
// 	}
// 	return (response.json() as Promise<{ userID: number }>);
// }

// export async function createUserProfile(log: any, userID: number, username: string): Promise<ProfileCreationResult> {
// 	const url = `http://users:2626/internal/users/${userID}/profile`;
// 	let response: Response;
// 	try {
// 		response = await fetch(url, {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify({ username: username })
// 		});
// 	} catch (error) {
// 		log.error(`[BFF] User service is unreachable: ${error}`);
// 		throw new Error('User service is unreachable.');
// 	}
// 	if (response.status === 409) {
// 		log.warn(`[BFF] Username already taken for profile creation`);
// 		const errorBody = (await response.json()) as { message: string };
// 		throw { code: 409, message: errorBody.message || 'Username is already taken.' };
// 	}
// 	if (!response.ok) {
// 		log.warn(`[BFF] Internal server error`);
// 		throw new Error(`Profile service failed with status ${response.status}`);
// 	}
// 	const data = await response.json();
// 	return { errorCode: 'success', data: data };
// }

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

export async function deleteUser(log: any, userID: number): Promise<void> {
	const url = `http://users:2626/internal/users/${userID}`;
	let response: Response;
	try {
		response = await fetch(url, { method: 'DELETE' });
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] Profile not found account deletion: ${userID}`);
		const errorBody = await response.json() as { message: string };
		throw { code: 404, message: errorBody.message || 'Profile not found.' };
	}

	if (!response.ok) {
		log.warn(`[BFF] Internal server error`);
		throw new Error(`Profile service failed with status ${response.status}`);
	}
	return;
}

export async function deleteFriendship(log: any, userID: number): Promise<Response | null> {
	const url = `http://friends:1616/internal/friends/${userID}/friendships`;
	let response: Response;
	try {
		response = await fetch(url, { method: 'DELETE' });
	} catch (error) {
		log.error(`[BFF] Friends service is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	if (!response.ok) {
		log.warn(`[BFF] Internal server error`);
		throw new Error(`Friebnds service failed with status ${response.status}`);
	}
	return (response.json() as Promise<Response>);
}

export async function updateBio(log: any, userID: number, biography: string): Promise<void> {
	const url = `http://account:1414/internal/users/${userID}`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ biography: biography })
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
		log.warn(`[BFF] User not found for biography update: ${userID}`);
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
	const url = `http://users:2626/internal/account/${userID}`;
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
	const url = `http://users:2626/internal/users/${userID}`;
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

export async function fetchUserDataAccount(log: any, userID: number): Promise<AccountData> {
	const url = `http://account:1414/internal/account/${userID}/userData`;
		let response: Response;
	
		try {
			response = await fetch(url);
		} catch (error) {
			log.error(`[BFF] Account service is unreachable: ${error}`);
			throw new Error('Account service is unreachable.');
		}
	
		if (response.status === 404) {
			log.warn(`[BFF] Account data not found for user ${userID}`);
			throw new Error('User data not found.');
		}
	
		if (!response.ok) {
			log.error(`[BFF] Account service failed with status ${response.status}`);
			throw new Error('User service failed.');
		}
	
		const body = (await response.json()) as AccountDataResponse;
	
		if (!body.success || !body.accountData) {
			log.error(`[BFF] User service (userData) returned 200 OK but with a failure body.`);
			throw new Error('User service returned invalid data.');
		}
	
		return (body.accountData);
}

export async function fetchUserDataBatch(log: any, userIDs: number[]): Promise<AccountData[]> {
	if (!userIDs || userIDs.length === 0)
		return [];

	const url = 'http://account:1414/internal/account/userDataBatch';
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userIDs: userIDs }),
		});
	} catch (error) {
		log.error(`[BFF] Account service (userDataBatch) is unreachable: ${error}`);
		throw new Error('Account service is unreachable.');
	}

	if (!response.ok) {
		log.error(`[BFF] Account service (userDataBatch) failed with status ${response.status}`);
		throw new Error('Account service (batch) failed.');
	}

	const body = (await response.json()) as AccountDataBatchResponse;

	if (!body.success || !body.accountData) {
		log.error(`[BFF] Account service (userDataBatch) returned 200 OK but with a failure body.`);
		throw new Error('Account service (batch) returned invalid data.');
	}

	return (body.accountData);
}