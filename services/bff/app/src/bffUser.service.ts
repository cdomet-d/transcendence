import type { FriendshipStatus } from "./bff.interface.js";
import type { RawUserActivity } from "./bff.interface.js";
import type { UserProfile } from "./bff.interface.js";

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

export async function fetchUserProfiles(userIDs: number[]): Promise<UserProfile[]> {
	if (userIDs.length === 0)
		return [];

	const response = await fetch('http://users:2626/internal/users/profile', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userIDs })
	});

	if (!response.ok)
		throw (new Error('Users service failed.'));

	return (response.json() as Promise<UserProfile[]>);
}