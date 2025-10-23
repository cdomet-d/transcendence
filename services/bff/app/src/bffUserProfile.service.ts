import type { UserProfile, ProfileResponse, Friend, UserStats, StatsResponse, Matches } from "./bff.interface.js";

//TODO change to smart route
export async function fetchUserProfile(userID: number): Promise<UserProfile | null> {
	const response = await fetch(`http://users:2626/internal/users/${userID}/profile`)
	if (response.status === 404)
		return (null);
	if (!response.ok)
		throw (new Error('Users service failed.'));

	const data = await response.json() as ProfileResponse;
	return (data.profile);
}

//TODO change to smart route
export async function fetchUserStats(userID: number): Promise<UserStats | null> {
	const response = await fetch (`http://users:2626/internal/users/${userID}/stats`);
	if (response.status == 404)
		return (null);
	if (!response.ok)
		throw (new Error('Users service failed.'));
	const data = await response.json() as StatsResponse;
	return (data.stats);
}

//TODO change to smart route
export async function fetchFriendList(userID: number): Promise<Friend[]> {
	const response = await fetch(`http://friends:1616/internal/friends/${userID}/friendslist`);

	if (!response.ok)
		throw (new Error('Friends service failed.'));

	return (response.json() as Promise<Friend[]>);
}

//TODO change to smart route
export async function fetchMatches (userID: number): Promise< Matches[] | null> {
	const response = await fetch(`/internal/dashboard/${userID}/gameHistory`);
	if (response.status == 404)
		return (null);
	if (!response.ok)
		throw (new Error('Dashboard service failed.'));
	return (response.json() as Promise<Matches[]>);
}