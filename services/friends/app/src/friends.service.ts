import { Database } from 'sqlite';

interface UserData {
	userID: number;
	username: string;
}

interface PendingRequest {
	otherUserID: number;
	startTime: string;
}

interface UserProfile {
	avatar: string;
	biography: string;
	joinedOn: string;
	profileColor: string;
	rank: string;
	status: boolean;
	username: string;
}

// Reusable function to get a user by their ID from the users service
export async function getUserID(username: string): Promise<UserData> {
	try {
		const response = await fetch(`https://users:2626/internal/users/by-username/${username}`);

		if (response.status === 404)
			throw (new Error(`User with username '${username}' not found.`));

		if (!response.ok)
			throw new Error(`Users service returned status: ${response.status}`);

		return (await response.json() as UserData);

	} catch (error) {
		console.error(`Error fetching user with ID ${username}:`, error);
		throw (error); 
	}
}

export async function checkUserExists(userID: number): Promise<UserData> {
	try {
		const response = await fetch(`https://users:2626/internal/users/by-username/${userID}`);

		if (response.status === 404)
			throw (new Error(`User with username '${userID}' not found.`));

		if (!response.ok)
			throw new Error(`Users service returned status: ${response.status}`);

		return (await response.json() as UserData);

	} catch (error) {
		console.error(`Error fetching user with ID ${userID}:`, error);
		throw (error); 
	}
}

export async function getPendingFriendRequests(db: Database, userId: number): Promise<PendingRequest[]> {
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
	const requests = await db.all<PendingRequest[]>(query, params);

	return (requests);
}

export async function getFriendship(db: Database, userId: number): Promise<PendingRequest[]> {
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
	const requests = await db.all<PendingRequest[]>(query, params);

	return (requests);
}

// Fetches the full user profile card from the users service
export async function getUserProfile(userID: number): Promise<UserProfile> {
	try {
		const response = await fetch(`https://users:2626/internal/users/profile/${userID}`);
		
		if (response.status === 404)
			throw (new Error(`User with username '${userID}' not found.`));
		if (!response.ok) throw new Error(`Users service returned status: ${response.status}`);

		return await response.json() as UserProfile;
	} catch (error) {
		console.error(`Error fetching profile for user ID ${userID}:`, error);
		throw error;
	}
}

export async function friendshipExistsUsersID(db: Database, userA_ID: number, userB_ID: number): Promise<boolean> {
	const query = `
		SELECT 1 FROM friendship 
		WHERE (userID = ? AND friendID = ?) 
			OR (userID = ? AND friendID = ?)
		LIMIT 1;
	`;

	const params = [userA_ID, userB_ID, userB_ID, userA_ID];
	const result = await db.get(query, params);

	// The '!!' converts the result (an object or undefined) to a boolean.
	return (!!result);
}

export async function friendshipExistsFriendshipID(db: Database, friendshipID: number): Promise<boolean> {
	const query = `
		SELECT 1 FROM friendship 
		WHERE (friendshipID = ?) 
		LIMIT 1;
	`;

	const params = [friendshipID];
	const result = await db.get(query, params);

	return (!!result);
}