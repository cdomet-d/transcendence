import type { UserData } from './bff.interface.js';
import type { Friend } from './bff.interface.js';
import type { UserProfile } from './bff.interface.js';

export async function findUserByUsername(username: string): Promise<UserData | null> {
	const response = await fetch(`http://users:2626/internal/users/${username}/userID`);
	if (response.status === 404)
		return (null);
	if (!response.ok)
		throw (new Error('Users service failed.'));
	return (response.json() as Promise<UserData>);
}

export async function createFriendRequest(senderID: number, friendID: number): Promise<Response> {
	return (fetch('http://friends:1616/internal/friends/sendrequest', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ senderID, friendID })
	}));
}

export async function acceptFriendRequest(senderRequestID: number, friendID: number): Promise<Response> {
	return (fetch('http://friends:1616//internal/friends/acceptrequest', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ senderRequestID, friendID })
	}));
}

export async function deleteFriendRequest(removerID: number, friendID: number): Promise<Response> {
	return (fetch('http://friends:1616//internal/friends/deletefriendship', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ removerID, friendID })
	}));
}

export async function fetchFriendList(userID: number): Promise<Friend[]> {
	const response = await fetch(`http://friends:1616/internal/friends/${userID}/friendslist`);

	if (!response.ok)
		throw (new Error('Friends service failed.'));

	return (response.json() as Promise<Friend[]>);
}

export async function fetchRawFriendRequests(userID: number): Promise<Friend[]> {
	const response = await fetch(`http://friends:1616/internal/friends/${userID}/friend-requests`);

>	if (!response.ok)
		throw (new Error('Friends service failed.'));

	return (response.json() as Promise<Friend[]>);
}


