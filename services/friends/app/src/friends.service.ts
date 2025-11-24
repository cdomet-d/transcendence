import { Database } from 'sqlite';

interface Friendship {
	friendshipID: number,
	userID: number,
	friendID: number,
	startTime: string,
	statusFriendship: boolean
}

export async function getFriendship(db: Database, userID: number): Promise<Friendship[]> {
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

export async function friendshipExistsUsersID(db: Database, userA_ID: number, userB_ID: number): Promise<number | null> {
	const query = `
		SELECT 1 FROM friendship 
		WHERE (userID = ? AND friendID = ?) 
			OR (userID = ? AND friendID = ?)
		LIMIT 1;
	`;

	const params = [userA_ID, userB_ID, userB_ID, userA_ID];
	const response = await db.get<{ friendshipID: number }>(query, params);

	return (response ? response.friendshipID : null);
}
