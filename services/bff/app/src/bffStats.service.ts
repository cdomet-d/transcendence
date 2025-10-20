
export async function fetchUserStats(userID: number): Promise<Response> {
	const url = `http://users:3000/internal/users/${userID}/stats`;
	return fetch(url);
}

export async function updateUserStats(userID: number, statsData: object): Promise<Response> {
	const url = `http://users:3000/internal/users/${userID}/stats`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(statsData)
	});
}

export async function incrementWinStreak(userID: number): Promise<Response> {
	const url = `http://users:3000/internal/users/${userID}/stats/win-streak/increment`;
	return fetch(url, {
		method: 'POST'
	});
}

export async function resetWinStreak(userID: number): Promise<Response> {
	const url = `http://users:3000/internal/users/${userID}/stats/win-streak/reset`;
	return fetch(url, {
		method: 'POST'
	});
}
