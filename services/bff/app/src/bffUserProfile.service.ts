import type {
	ProfileDataBatch, ProfileDataBatchResponse, ProfileView,
	ProfileData, UserStats, StatsResponse, Matches, RawMatches, Friends,
	ProfileDataResponse,
	userData
} from "./bff.interface.js";

export async function fetchUserProfile(log: any, userID: number): Promise<userData | null> {
	const url = `http://users:2626/internal/users/${userID}/profile`;
	let response: Response;

	try {
		response = await fetch(url)
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

	const data = await response.json() as userData;
	return (data);
}

export async function fetchUserID(log: any, username: string): Promise<number> {
	const url = `http://users:2626/internal/users?username=${username}`;

	let response: Response;
	try {
		response = await fetch(url)
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}
	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user ${username}`);
		throw new Error('User data not found.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}

	const data = await response.json() as number;
	return (data);
}

export async function fetchUserStats(log: any, userID: number): Promise<UserStats | null> {
	const url = `http://users:2626/internal/users/${userID}/stats`;
	let response: Response;

	try {
		response = await fetch(url);
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
	const data = await response.json() as StatsResponse;
	return (data.stats);
}

//TODO fetch userData in friendlist.............................................
export async function fetchFriendList(log: any, userID: number): Promise<Friends[]> {
	const url = `http://friends:1616/internal/friends/friendships?userID=${userID}&status=friend`;
	let response: Response;

	try {
		response = await fetch(url);
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.error('[BFF] Bad request to friends service (friendlist).');
		throw new Error('Bad request to friends service.');
	}

	if (!response.ok) {
		log.error(`[BFF] Friends service (friendlist) failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}

	return (response.json() as Promise<Friends[]>);
}

export async function fetchProfileData(log: any, userID: number): Promise<ProfileData> {
	const url = `http://users:2626/internal/users/${userID}/userData`;
	let response: Response;

	try {
		response = await fetch(url);
	} catch (error) {
		log.error(`[BFF] User service (userData) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user ${userID}`);
		throw new Error('User data not found.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service (userData) failed with status ${response.status}`);
		throw new Error('User service failed.');
	}

	const body = (await response.json()) as ProfileDataResponse;

	if (!body.success || !body.profileData) {
		log.error(`[BFF] User service (userData) returned 200 OK but with a failure body.`);
		throw new Error('User service returned invalid data.');
	}

	return (body.profileData);
}

export async function fetchProfileDataBatch(log: any, userIDs: number[]): Promise<ProfileDataBatch[]> {
	if (!userIDs || userIDs.length === 0)
		return [];

	const url = 'http://users:2626/internal/users/userDataBatch';
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userIDs: userIDs }),
		});
	} catch (error) {
		log.error(`[BFF] User service (userDataBatch) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service (userDataBatch) failed with status ${response.status}`);
		throw new Error('User service (batch) failed.');
	}

	const body = (await response.json()) as ProfileDataBatchResponse;

	if (!body.success || !body.profileData) {
		log.error(`[BFF] User service (userDataBatch) returned 200 OK but with a failure body.`);
		throw new Error('User service (batch) returned invalid data.');
	}

	return (body.profileData);
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return (`${mins}m ${secs}s`);
}

async function fetchMatches(log: any, userID: string): Promise<RawMatches[]> {
	const url = `http://users:2626/internal/dashboard/${userID}/gameHistory`;
	let response: Response;
	try {
		response = await fetch(url);

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

async function fetchUsernamesForMatches(log: any, matches: RawMatches[]): Promise<Map<number, string>> {
	const opponentIDs = [...new Set(matches.map(match => match.opponentID))];

	if (opponentIDs.length === 0) {
		return new Map();
	}

	const usersData = await fetchProfileDataBatch(log, opponentIDs);

	const usernameMap = new Map<number, string>();
	for (const user of usersData)
		usernameMap.set(user.userID, user.username);

	return (usernameMap);
}

export async function processMatches(log: any, userID: string): Promise<Matches[]> {
	const rawMatches = await fetchMatches(log, userID);

	if (rawMatches.length === 0)
		return [];

	const opponentMap = await fetchUsernamesForMatches(log, rawMatches);

	const numericUserID = Number(userID);

	const processedMatches = rawMatches.map(rawMatch => {
		const outcome = rawMatch.winnerID === numericUserID ? "Win" : "Loss";
		const score = `${rawMatch.scoreWinner} - ${rawMatch.scoreLoser}`;
		const opponentName = opponentMap.get(rawMatch.opponentID) || "Unknown User";
		const isTournament = 'tournamentID' in rawMatch && (rawMatch as any).tournamentID > 0;

		const match: Matches = {
			date: new Date(rawMatch.startTime).toLocaleDateString(),
			opponent: opponentName,
			outcome: outcome,
			score: score,
			duration: formatDuration(rawMatch.duration),
			tournament: isTournament
		};

		return (match);
	});

	return (processedMatches);
}

export async function fetchRelationship(log: any, userID: number, username: string): Promise<ProfileView> {
	const url = `http://users:2626/internal/users/${username}/userID`;

	let response: Response;

	try {
		response = await fetch(url);
	} catch (error) {
		log.error(`[BFF] Account service is unreachable: ${error}`);
		return 'stranger';
	}

	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user ${userID}`);
		return 'stranger';
	}

	if (!response.ok) {
		log.error(`[BFF] User service (userData) failed with status ${response.status}`);
		return 'stranger';
	}
	const userData = await response.json() as {
		success: boolean;
		message: string;
		user: { userID: number; username: string; }
	};

	const targetUserID = userData.user.userID;
	if (targetUserID === userID)
		return 'self';

	const friendsUrl = `http://friends-service:1616/internal/relationship?userA=${userID}&userB=${targetUserID}`;
	let friendsResponse: Response;

	try {
		friendsResponse = await fetch(friendsUrl);
	} catch (error) {
		log.error(`[BFF] Friends service is unreachable: ${error}`);
		return 'stranger';
	}

	if (!friendsResponse.ok) {
		log.error(`[BFF] Friends service failed with status ${friendsResponse.status}`);
		return 'stranger';
	}

	const friendshipData = await friendsResponse.json() as { status: ProfileView };
	return (friendshipData.status);
}
