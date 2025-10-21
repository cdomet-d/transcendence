import type { FriendshipStatus } from "./bff.interface.js";
import type { RawUserActivity } from "./bff.interface.js";
import type { UserProfile } from "./bff.interface.js";
import type { ProfileResponse } from "./bff.interface.js";

export async function fetchUserProfile(userID: number): Promise<UserProfile | null> {
	const response = await fetch(`http://users:2626/internal/users/${userID}/profile`)
	if (response.status === 404)
		return (null);
	if (!response.ok)
		throw (new Error('Users service failed.'));

	const data = await response.json() as ProfileResponse;
	return (data.profile);
}

//TODO: update route name in friends service
export async function fetchFriendshipStatus(userA: number, userB: number): Promise<FriendshipStatus> {
	const response = await fetch(`http://friends:1616/internal/friends/relationship?userA=${userA}&userB=${userB}`);
	if (!response.ok)
		return { status: 'stranger' };
	return (response.json() as Promise<FriendshipStatus>);
}

export async function fetchUserActivityStatus(userID: number): Promise<RawUserActivity> {
	const response = await fetch(`https://user:2626/internal/users/activity/${userID}`);
	if (!response.ok)
		throw new Error(`Users service failed with status: ${response.status}`);
	return response.json() as Promise<RawUserActivity>;
}

//TODO: what fucking route is that calling. It should be calling this :serv.patch('/internalUserProfile/users/:userID/profile', async (request, reply) => {
export async function updateUserProfileField(userID: number, field: string, value: any): Promise<Response> {
	const url = `http://users:2626/internal/users/${userID}/${field}`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ "value": value })
	});
}

export async function fetchProfileColor(userID: number) {
	const response = await fetch(`https://user:2626/internal/users/${userID}/profileColor`);
	if (!response.ok) {
		if (response.status === 404)
			throw (new Error('User not found.'));
		throw (new Error('Account service failed.'));
	}
	return (response.json());
}

export async function fetchBio(userID: number) {
	const response = await fetch(`https://user:2626/internal/users/${userID}/bio`);
	if (!response.ok) {
		if (response.status === 404)
			throw (new Error('User not found.'));
		throw (new Error('Account service failed.'));
	}
	return (response.json());
}
