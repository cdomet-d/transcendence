import { request } from 'http';
import { Database } from 'sqlite';

interface Friendship {
	friendshipID: number,
	userID: string,
	friendID: string,
	startTime: string,
	statusFriendship: boolean
}

export async function getFriendship(db: Database, userID: string): Promise<Friendship[]> {
	const query = `
		SELECT
			friendshipID,
			userID,
			friendID,
			statusFriendship
		FROM
			friendship
		WHERE (userID = ?) 
			OR (friendID = ?)
	`;

	const params = [userID, userID];
	const requests = await db.all<Friendship[]>(query, params);

	return (requests);
}

export async function getFriendshipPending(db: Database, userID: string): Promise<Friendship[]> {
	const query = `
		SELECT
			userID,
			friendshipID,
			friendID,
			statusFriendship
		FROM
			friendship
		WHERE (friendID = ?)
	`;

	const params = [userID];
	const requests = await db.all<Friendship[]>(query, params);

	return (requests);
}

export async function friendshipExistsUsersID(db: Database, userA_ID: string, userB_ID: string) {
	const query = `
		SELECT friendshipID, statusFriendship FROM friendship 
		WHERE (userID = ? AND friendID = ?) 
			OR (userID = ? AND friendID = ?);
	`;

	const params = [userA_ID, userB_ID, userB_ID, userA_ID];
	const response = await db.get<any>(query, params);

	if (!response)
		return undefined;
	const isAccepted = String(response.statusFriendship) === 'true' || String(response.statusFriendship) === '1';
	if (isAccepted)
		throw { code: 409, message: 'Friendship already accepted.' };

	return response.friendshipID;
}
