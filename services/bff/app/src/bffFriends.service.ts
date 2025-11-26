export async function createFriendRequest(log: any, senderID: number, friendID: number, token: string): Promise<void> {
	const url = 'http://friends:1616/relation';
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'POST',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ senderID, friendID })
		});
	} catch (error) {
		log.error(`[BFF] Friends service (sendrequest) is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	//TODO return error to handle in route
	if (response.status === 409) {
		log.warn(`[BFF] Friend request failed: Friendship already exists between ${senderID} and ${friendID}`);
		return;
	}

	//TODO return error to handle in route
	if (response.status === 404) {
		log.error(`[BFF] Friends service (sendrequest) reported 404: Friend request could not be sent.`);
		throw new Error('Friend request could not be sent, user could not be found');
	}

	//TODO return error to handle in route
	if (!response.ok) {
		log.error(`[BFF] Friends service (sendrequest) failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}

	return;
}

export async function acceptFriendRequest(log: any, senderRequestID: number, friendID: number, token: string): Promise<void> {
	const url = 'http://friends:1616/relation';
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			},
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

	//TODO return error to handle in route
	if (response.status === 404) {
		log.error(`[BFF] Friends service (acceptfriend) reported 404: Friend request could not be accepted.`);
		throw new Error('Friend request could not be accepted due to a server error.');
	}

	//TODO return error to handle in route
	if (!response.ok) {
		log.error(`[BFF] Friends service (acceptfriend) failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}

	return;
}

export async function deleteFriendRequest(log: any, removerID: number, friendID: number, token: string): Promise<void> {
	const url = 'http://friends:1616/relation';
	let response: Response;

	try {
		response = await (fetch(url, {
			method: 'DELETE',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			},
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

	//TODO return error to handle in route
	if (response.status === 404) {
		log.error(`[BFF] Friends service (deletefriend) reported 404: Friend request could not be deleted.`);
		throw new Error('Friend request could not be deleted due to a server error.');
	}

	//TODO return error to handle in route
	if (!response.ok) {
		log.error(`[BFF] Friends service (deletefriend) failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}

	return;
}



/*----------  WIP  ----------*/

/* export async function deleteFriendship(log: any, userID: number): Promise<Response | null> {
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
} */