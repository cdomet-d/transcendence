import type { UserAuth } from './bff.interface.js';

export async function findUserByUsername(log: any, username: string): Promise<UserAuth | null> {
	const url = `https://users:2626/internal/users?username=${username}`;
	let response: Response;

	try {
		response = await fetch(url);
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user ${username}`);
		throw new Error('User data not found.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return (response.json() as Promise<UserAuth>);
}

export async function createFriendRequest(log: any, senderID: number, friendID: number): Promise<void> {
	const url = 'https://friends:1616/internal/friends/friendship';
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ senderID, friendID })
		});
	} catch (error) {
		log.error(`[BFF] Friends service (sendrequest) is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	if (response.status === 409) {
		log.warn(`[BFF] Friend request failed: Friendship already exists between ${senderID} and ${friendID}`);
		return ;
	}

	if (response.status === 404) {
		log.error(`[BFF] Friends service (sendrequest) reported 404: Friend request could not be sent.`);
		throw new Error('Friend request could not be sent, user could not be found');
	}

	if (!response.ok) {
		log.error(`[BFF] Friends service (sendrequest) failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}

	return;
}

export async function acceptFriendRequest(log: any, senderRequestID: number, friendID: number): Promise<void> {
	const url = 'https://friends:1616/internal/friends/sendrequest';
	let response: Response;
	
	try {
		response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ senderRequestID, friendID })
		});
	} catch (error) {
		log.error(`[BFF] Friends service (acceptfriend) is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	if (response.status === 409) {
		log.warn(`[BFF] Friend request failed: Friendship already exists between ${senderRequestID} and ${friendID}`);
		const errorBody = await response.json() as { message: string };
		throw { code: 409, message: errorBody.message || 'Friendship already exists.' };
	}

	if (response.status === 404) {
		log.error(`[BFF] Friends service (acceptfriend) reported 404: Friend request could not be accepted.`);
		throw new Error('Friend request could not be accepted due to a server error.');
	}

	if (!response.ok) {
		log.error(`[BFF] Friends service (acceptfriend) failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}

	return;
}

export async function deleteFriendRequest(log: any, removerID: number, friendID: number): Promise<void> {
		const url = 'https://friends:1616//internal/friends/deletefriendship';
	let response: Response;
	
	try {
		response = await(fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ removerID, friendID })
	}));

	} catch (error) {
		log.error(`[BFF] Friends service (deletefriend) is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	if (response.status === 409) {
		log.warn(`[BFF] Friend request failed: Friendship already exists between ${removerID} and ${friendID}`);
		const errorBody = await response.json() as { message: string };
		throw { code: 409, message: errorBody.message || 'Friendship already exists.' };
	}

	if (response.status === 404) {
		log.error(`[BFF] Friends service (deletefriend) reported 404: Friend request could not be deleted.`);
		throw new Error('Friend request could not be deleted due to a server error.');
	}

	if (!response.ok) {
		log.error(`[BFF] Friends service (deletefriend) failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}

	return;
}
