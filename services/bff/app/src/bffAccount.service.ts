export async function validateCredentials(username: string, password: string): Promise<Response> {
	const url = 'http://account-service:3000/internal/accounts/login';
	return fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	});
}

export async function updateAccountUsername(userID: number, newUsername: string): Promise<Response> {
	const url = `http://account-service:3000/internal/accounts/${userID}/username`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ newUsername })
	});
}

export async function updateAccountPassword(userID: number, newHashedPassword: string): Promise<Response> {
	const url = `http://account-service:3000/internal/accounts/${userID}/password`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ newHashedPassword })
	});
}

export async function updateUserProfileUsername(userID: number, newUsername: string): Promise<Response> {
	const url = `http://users-service:3000/internal/users/${userID}/username`;
	return fetch(url, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ newUsername })
	});
}