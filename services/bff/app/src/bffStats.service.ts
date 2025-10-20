
import type { UserStats } from "./bff.interface.js";
import type { StatsResponse } from "./bff.interface.js";

export async function fetchUserStats(userID: number): Promise<UserStats | null> {
	const response = await fetch (`http://users:2626/internal/users/${userID}/stats`);
	if (response.status == 404)
		return (null);
	if (!response.ok)
		throw (new Error('Users service failed.'));
	const data = await response.json() as StatsResponse;
	return (data.stats);
}

export async function updateUserStats(userID: number, statsData: object): Promise<Response> {
	const url = `http://users:2626/internal/users/${userID}/stats`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(statsData)
	});
}

export async function incrementWinStreak(userID: number): Promise<Response> {
	const url = `http://users:2626/internal/users/${userID}/stats/winStreak/increment`;
	return fetch(url, {
		method: 'POST'
	});
}

export async function resetWinStreak(userID: number): Promise<Response> {
	const url = `http://users:2626/internal/users/${userID}/stats/winStreak/reset`;
	return fetch(url, {
		method: 'POST'
	});
}
