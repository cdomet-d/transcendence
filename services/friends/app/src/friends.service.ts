interface UserData {
  userID: number;
  username: string;
}

interface PendingRequest {
	senderID: number;
	startTime: string;
}

// Reusable function to get a user by their ID from the users service
export async function getUserID(username: string): Promise<UserData | null> {
	try {
		const response = await fetch(`http://users:2626/internal/users/by-username/${username}`);

		if (response.status === 404)
			return (null);

		if (!response.ok)
			throw new Error(`Users service returned status: ${response.status}`);

		return (await response.json() as UserData);

	} catch (error) {
		console.error(`Error fetching user with ID ${username}:`, error);
		throw (error); 
	}
}

export async function checkUserExists(userID: number): Promise<UserData | null> {
	try {
		const response = await fetch(`http://users:2626/internal/users/by-username/${userID}`);

		if (response.status === 404)
			return null;

		if (!response.ok)
			throw new Error(`Users service returned status: ${response.status}`);

		return (await response.json() as UserData);

	} catch (error) {
		console.error(`Error fetching user with ID ${userID}:`, error);
		throw (error); 
	}
}

// Gets all pending requests where the user is the receiver
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

	const requests = await db.all<PendingRequest[]>(query, [userId]);
	return (requests);
}
