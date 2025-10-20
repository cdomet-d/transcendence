import type { FriendshipStatus } from "./bff.interface.js";
import type { RawUserActivity } from "./bff.interface.js";

//TODO :code the friend internal route
export async function fetchFriendshipStatus(userA: number, userB: number): Promise<FriendshipStatus> {
	const response = await fetch(`http://friends:1616/internal/relationship?userA=${userA}&userB=${userB}`);
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

export async function updateUserProfileField(userID: number, field: string, value: any): Promise<Response> {
	const url = `http://users:3000/internal/users/${userID}/${field}`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ "value": value })
	});
}

//TODO :
//export async function fetchUserProfile(userID: number): Promise<RawUserProfile | null> { }

//TODO: 
//export async function findUserByUsername(username: string): Promise<{ userID: number } | null> { /* ... */ }

