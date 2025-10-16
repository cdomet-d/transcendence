import type { UserData } from './gateway.interface.js';
import type { RawFriend } from './gateway.interface.js';
import type { UserProfile } from './gateway.interface.js';

export async function findUserByUsername(username: string): Promise<UserData | null> {
	const response = await fetch(`http://users-service:3000/internal/users/by-username/${username}`);

	if (response.status === 404)
		return (null);
	
	if (!response.ok)
		throw (new Error('Users service failed.'));
	
	return (response.json() as Promise<UserData>);
}

export async function createFriendRequest(senderID: number, friendID: number): Promise<Response> {
	return (fetch('http://friends-service:3000/internal/friends/sendrequest', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ senderID, friendID })
	}));
}

export async function acceptFriendRequest(senderRequestID: number, friendID: number): Promise<Response> {
	return (fetch('http://friends-service:3000//internal/friends/acceptrequest', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ senderRequestID, friendID })
	}));
}

export async function deleteFriendRequest(removerID: number, friendID: number): Promise<Response> {
	return (fetch('http://friends-service:3000//internal/friends/deletefriendship', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ removerID, friendID })
	}));
}

export async function fetchRawFriends(userID: number): Promise<RawFriend[]> {
	const response = await fetch(`http://friends-service:3000/internal/users/${userID}/friends`);
	
	if (!response.ok)
		throw (new Error('Friends service failed.'));
	
	return (response.json() as Promise<RawFriend[]>);
}

export async function fetchRawFriendRequests(userID: number): Promise<RawFriend[]> {
	const response = await fetch(`http://friends-service:3000/internal/users/${userID}/friend-requests`);
	
	if (!response.ok)
		throw (new Error('Friends service failed.'));
	
	return (response.json() as Promise<RawFriend[]>);
}

export async function fetchUserProfiles(userIDs: number[]): Promise<UserProfile[]> {
	if (userIDs.length === 0)
		return [];
	
	const response = await fetch('http://users-service:3000/internal/users/profiles-by-ids', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userIDs })
	});
	
	if (!response.ok)
		throw (new Error('Users service failed.'));
	
	return (response.json() as Promise<UserProfile[]>);
}
