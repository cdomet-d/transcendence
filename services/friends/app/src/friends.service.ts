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

export async function getPendingFriendRequests(db: Database, userId: number): Promise<PendingRequest[]> {
    console.log("in getPendingFriendRequests function");
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

    // The corrected parameters array
    const params = [userId, userId, userId];
    
    const requests = await db.all<PendingRequest[]>(query, params);
    
    // This should now return the correct data
    return requests;
}

// Fetches the full user profile card from the users service
export async function getUserProfile(userId: number): Promise<UserProfile | null> {
	try {
		// NOTE: This assumes you have an endpoint like this on your users service
		const response = await fetch(`http://users:2626/internal/users/profile/${userId}`);
		
		if (response.status === 404) return null;
		if (!response.ok) throw new Error(`Users service returned status: ${response.status}`);

		return await response.json() as UserProfile;
	} catch (error) {
		console.error(`Error fetching profile for user ID ${userId}:`, error);
		throw error;
	}
}
