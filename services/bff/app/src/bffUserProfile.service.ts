import type {
	UsernameResponse, FriendshipStatus, Friendship, ProfileDataBatch, ProfileDataBatchResponse, ProfileView, userStats, StatsResponse, Matches, RawMatches,
	userData, UserIDResponse
} from "./bff.interface.js";

export async function buildTinyProfile(log: any, viewerUserID: number, targetUsername: string, token: string): Promise<userData | null> {

	const targetUserID = await fetchUserID(log, targetUsername, token);

	if (!targetUserID) {
		log.warn(`[BFF] buildTinyProfile: UserID not found for ${targetUsername}`);
		return (null);
	}

	const [data, relation] = await Promise.all([
		fetchUserData(log, targetUserID, token),
		fetchProfileView(log, viewerUserID, targetUserID, token)
	]);

	if (!data) {
		log.warn(`[BFF] buildTinyProfile: Data not found for userID ${targetUserID}`);
		return (null);
	}

	return {
		userID: String(targetUserID),
		username: data.username,
		avatar: data.avatar,
		biography: data.biography,
		profileColor: data.profileColor,
		since: data.since,
		status: data.status,
		winstreak: data.winstreak,
		lang: data.lang,
		relation: relation
	};
}

export async function searchBar(log: any, username: string, token: string): Promise<userData[]> {
	const url = `http://users:2626/search?name=${username}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		log.error(`[BFF] User service (search) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service (search) failed with status ${response.status}`);
		throw new Error('User service failed.');
	}

	const body = (await response.json()) as { success: boolean; profiles: userData[] };

	if (!body.success || !body.profiles) {
		log.error(`[BFF] User service (search) returned 200 OK but with a failure body.`);
		throw new Error('User service returned invalid data.');
	}

	return body.profiles;
}

export async function fetchUserData(log: any, userID: number, token: string): Promise<userData | null> {
	const url = `http://users:2626/${userID}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		log.error(`[BFF] User service (userData) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user ${userID}`);
		return null;
	}

	if (!response.ok) {
		log.error(`[BFF] User service (userData) failed with status ${response.status}`);
		throw new Error('User service failed.');
	}

	const body = (await response.json()) as { success: boolean; userData: userData };

	if (!body.success || !body.userData) {
		log.error(`[BFF] User service (userData) returned 200 OK but with a failure body.`);
		throw new Error('User service returned invalid data.');
	}

	return body.userData;
}

export async function fetchProfileView(log: any, userID: number, targetUserID: number, token: string): Promise<ProfileView> {

	if (Number(targetUserID) === Number(userID))
		return ('self');

	let friendsResponse: Response;
	const friendsUrl = `http://friends:1616/friendship?userA=${userID}&userB=${targetUserID}`;

	try {
		friendsResponse = await fetch(friendsUrl, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		log.error(`[BFF] Friends service is unreachable: ${error}`);
		return 'stranger';
	}

	if (!friendsResponse.ok) {
		log.error(`[BFF] Friends service failed with status ${friendsResponse.status}`);
		return 'stranger';
	}

	const friendshipData = (await friendsResponse.json()) as { status: ProfileView };
	return friendshipData.status;
}

export async function fetchUserID(log: any, username: string, token: string): Promise<number | null> {
	const url = `http://users:2626/userID/${username}`;

	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		log.error(`[BFF] User service (userID) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user`);
		return null;
	}

	if (!response.ok) {
		log.error(`[BFF] User service (userData) failed with status ${response.status}`);
		throw new Error('User service is unreachable.');
	}

	const body = (await response.json()) as UserIDResponse;

	if (!body.response || !body.response.userID)
		throw new Error('Invalid response structure from user service');

	return body.response.userID;
}

export async function fetchUserStats(log: any, userID: number, token: string): Promise<userStats | null> {
	const url = `http://users:2626/stats/${userID}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}
	if (response.status === 404) {
		log.warn(`[BFF] User stats not found for user ${userID}`);
		throw new Error('User stats not found.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	const data = (await response.json()) as StatsResponse;
	return data.stats;
}

//The 'since' in the friendlist will store the friendship creation data, not the creation of the profile of the friend
// Make a issue on github if you'd rather it to be the creation of the friend's profile 
export async function fetchFriendships(log: any, userID: number, status: FriendshipStatus, token: string): Promise<userData[]> {
	const url = `http://friends:1616/friendlist?userID=${userID}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		log.error(`[BFF] Friends service is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	if (response.status === 404)
		return [];

	if (!response.ok) {
		log.error(`[BFF] Friends service failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}

	const friendships = await response.json() as Friendship[];

	const targetIsAccepted = (status === 'friend');

	const filteredList = friendships.filter(f => {
		const isAccepted = String(f.statusFriendship) === 'true' || String(f.statusFriendship) === '1';

		return (isAccepted === targetIsAccepted);
	});

	const profilePromises = filteredList.map(async (friendship) => {
		try {
			const otherID = (friendship.userID === userID) ? friendship.friendID : friendship.userID;

			const profile = await fetchUserData(log, otherID, token);

			if (profile) {
				(profile as any).relation = status;
				profile.since = friendship.startTime;
			}
			return (profile);
		} catch (err) {
			log.warn(`[BFF] Could not fetch profile for user ${friendship.friendID}`);
			return null;
		}
	});

	const profiles = await Promise.all(profilePromises);

	return profiles.filter((p): p is userData => p !== null);
}

async function fetchMatches(log: any, userID: number, token: string): Promise<RawMatches[]> {
	const url = `http://dashboard:1515/games/${userID}`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user ${userID}`);
		throw new Error('User data not found.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return (response.json() as Promise<RawMatches[]>);
}

async function fetchUsernames(log: any, userIDs: number[], token: string): Promise<Map<number, string>> {
	if (userIDs.length === 0) return new Map();

	const url = `http://users:2626/usernames`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'POST',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userIDs: userIDs }),
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service error.');
	}

	const body = await response.json() as UsernameResponse;

	const usernameMap = new Map<number, string>();

	if (body.usersNames) {
		for (const user of body.usersNames)
			usernameMap.set(user.userID, user.username);
	}

	return (usernameMap);
}

export async function processMatches(log: any, userID: number, token: string): Promise<Matches[]> {
	const rawMatches = await fetchMatches(log, userID, token);

	if (!rawMatches || rawMatches.length === 0)
		return [];

	const opponentIDs = new Set<number>();
	rawMatches.forEach(match => {
		const opponentID = (match.player1 === userID) ? match.player2 : match.player1;
		opponentIDs.add(opponentID);
	});

	const opponentMap = await fetchUsernames(log, Array.from(opponentIDs), token);

	const processedMatches = rawMatches.map(rawMatch => {
		const isPlayer1 = rawMatch.player1 === userID;

		const opponentID = isPlayer1 ? rawMatch.player2 : rawMatch.player1;
		const myScore = isPlayer1 ? rawMatch.player1Score : rawMatch.player2Score;
		const opponentScore = isPlayer1 ? rawMatch.player2Score : rawMatch.player1Score;

		let outcome = 'Draw';
		if (myScore > opponentScore) outcome = 'Win';
		if (myScore < opponentScore) outcome = 'Loss';

		const scoreWinner = Math.max(myScore, opponentScore);
		const scoreLoser = Math.min(myScore, opponentScore);
		const scoreString = `${scoreWinner} - ${scoreLoser}`;

		const opponentName = opponentMap.get(opponentID) || "Unknown User";

		const isTournament = rawMatch.tournamentID > 0;

		const match: Matches = {
			date: new Date(rawMatch.startTime).toLocaleDateString(),
			opponent: opponentName,
			outcome: outcome,
			score: scoreString,
			duration: formatDuration(rawMatch.duration),
			tournament: isTournament
		};

		return (match);
	});

	return (processedMatches);
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return (`${mins}m ${secs}s`);
}

export async function fetchLeaderboard(log: any, token: string): Promise<userData[]> {
	const url = `http://users:2626/leaderboard`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service error.');
	}

	const body = (await response.json()) as { success: boolean, profiles: userData[] };

	if (!body.success || !body.profiles) {
		log.error(`[BFF] User service (search) returned 200 OK but with a failure body.`);
		throw new Error('User service returned invalid data.');
	}

	return (body.profiles);
}

/*----------  WIP  ----------*/

interface UserProfileUpdates {
	avatar?: string;
	biography?: string;
	profileColor?: string;
	defaultLang?: string;
}


export async function updateUserProfile(log: any, userID: number, updates: UserProfileUpdates/* , token: string */): Promise<void> {
	const url = `http://users:2626/${userID}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: {
			//	'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updates)
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	//TODO :change throw
	if (response.status === 400) {
		log.warn(`[BFF] User service validation error for user ${userID}`);
		throw new Error('User validation failed.');
	}

	//TODO :change throw
	if (response.status === 404) {
		log.warn(`[BFF] User not found for update: ${userID}`);
		throw new Error('User not found.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
}

export async function updateAuthSettings(log: any, userID: number, updates: UserProfileUpdates/* , token: string */): Promise<void> {
	const url = `http://auth:3939/${userID}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: {
			//	'Cookie': `token=${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updates)
		});
	} catch (error) {
		log.error(`[BFF] Auth service is unreachable: ${error}`);
		throw new Error('Auth service is unreachable.');
	}

	//TODO :change throw
	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error for user ${userID}`);
		throw new Error('Auth validation failed.');
	}

	//TODO :change throw
	if (response.status === 404) {
		log.warn(`[BFF] Auth not found for update: ${userID}`);
		throw new Error('Auth not found.');
	}

	if (!response.ok) {
		log.error(`[BFF] Auth service failed with status ${response.status}`);
		throw new Error('Auth service failed.');
	}
}
