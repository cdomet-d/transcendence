import { Database } from 'sqlite';

interface Friendship {
	otherUserID: number;
	startTime: string;
}

export async function getPendingFriendRequests(db: Database, userId: number): Promise<Friendship[]> {
	const query = `
		SELECT
			CASE
				WHEN userID = ? THEN friendID
				ELSE userID
			END AS otherUserID,
			startTimeFriendship AS startTime
		FROM
			friendship
		WHERE
			(userID = ? OR friendID = ?)
			AND statusFrienship = false;
	`;

	const params = [userId, userId, userId];
	const requests = await db.all<Friendship[]>(query, params);

	return (requests);
}

export async function getFriendship(db: Database, userId: number): Promise<Friendship[]> {
	const query = `
		SELECT
			CASE
				WHEN userID = ? THEN friendID
				ELSE userID
			END AS otherUserID,
			startTimeFriendship AS startTime
		FROM
			friendship
		WHERE
			(userID = ? OR friendID = ?)
			AND statusFrienship = true;
	`;

	const params = [userId, userId, userId];
	const requests = await db.all<Friendship[]>(query, params);

	return (requests);
}

export async function friendshipExistsUsersID(db: Database, userA_ID: number, userB_ID: number): Promise <number | null> {
	const query = `
		SELECT 1 FROM friendship 
		WHERE (userID = ? AND friendID = ?) 
			OR (userID = ? AND friendID = ?)
		LIMIT 1;
	`;

	const params = [userA_ID, userB_ID, userB_ID, userA_ID];
	const result = await db.get<{ friendshipID: number }>(query, params);

	return (result ? result.friendshipID : null);
}
