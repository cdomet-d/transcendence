import type {
	ProfileDataBatch, ProfileDataBatchResponse, ProfileView, userStats, StatsResponse, Matches, RawMatches,
	userData, UserIDResponse
} from "./bff.interface.js";

import { fetch, Agent } from 'undici';

const sslAgent = new Agent({
	connect: { rejectUnauthorized: false }
});

export async function buildTinyProfile(log: any, viewerUserID: number, targetUsername: string ): Promise<userData | null> {

	const targetUserID = await fetchUserID(log, targetUsername);

	if (!targetUserID) {
		log.warn(`[BFF] buildTinyProfile: UserID not found for ${targetUsername}`);
		return (null);
	}

	const [data, relation] = await Promise.all([
		fetchUserData(log, targetUserID),
		fetchProfileView(log, viewerUserID, targetUserID)
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

export async function searchBar(log: any, username: string): Promise<userData[]> {
	const url = `https://users:2626/search?name=${username}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			dispatcher: sslAgent
		});
	} catch (error) {
		log.error(`[BFF] User service (search) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service (search) failed with status ${response.status}`);
		throw new Error('User service failed.');
	}

	const body = (await response.json()) as { success: boolean, profiles: userData[] };

	if (!body.success || !body.profiles) {
		log.error(`[BFF] User service (search) returned 200 OK but with a failure body.`);
		throw new Error('User service returned invalid data.');
	}

	return (body.profiles);
}

export async function fetchUserData(log: any, userID: number): Promise<userData | null> {
	const url = `https://users:2626/${userID}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			dispatcher: sslAgent
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

	const body = (await response.json()) as { success: boolean, userData: userData };

	if (!body.success || !body.userData) {
		log.error(`[BFF] User service (userData) returned 200 OK but with a failure body.`);
		throw new Error('User service returned invalid data.');
	}

	return (body.userData);
}

export async function fetchProfileView(log: any, userID: number, targetUserID: number): Promise<ProfileView> {

	if (Number(targetUserID) === Number(userID))
		return ('self');

	let friendsResponse: Response;
	const friendsUrl = `https://friends:1616/friendship?userA=${userID}&userB=${targetUserID}`;

	try {
		friendsResponse = await fetch(friendsUrl, {
			method: 'GET',
			dispatcher: sslAgent
		});
	} catch (error) {
		log.error(`[BFF] Friends service is unreachable: ${error}`);
		return ('stranger');
	}

	if (!friendsResponse.ok) {
		log.error(`[BFF] Friends service failed with status ${friendsResponse.status}`);
		return ('stranger');
	}

	const friendshipData = await friendsResponse.json() as { status: ProfileView };
	return (friendshipData.status);
}

export async function fetchUserID(log: any, username: string): Promise<number | null> {
	const url = `https://users:2626/userID/${username}`;

	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			dispatcher: sslAgent
		});
	} catch (error) {
		log.error(`[BFF] User service (userID) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user`);
		return (null);
	}

	if (!response.ok) {
		log.error(`[BFF] User service (userData) failed with status ${response.status}`);
		throw new Error('User service is unreachable.');
	}

	const body = await response.json() as UserIDResponse;

	if (!body.response || !body.response.userID)
		throw new Error('Invalid response structure from user service');

	return body.response.userID;
}

export async function fetchUserStats(log: any, userID: number): Promise<userStats | null> {
	const url = `https://users:2626/stats/${userID}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			dispatcher: sslAgent
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
	const data = await response.json() as StatsResponse;
	return (data.stats);
}

//TODO fetch userData in friendlist.............................................
export async function fetchFriendList(log: any, userID: number): Promise<userData[]> {
	const url = `https://friends:1616/friendship?userID=${userID}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			dispatcher: sslAgent
		});
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

	return (response.json() as Promise<userData[]>);
}

async function fetchMatches(log: any, userID: number): Promise<RawMatches[]> {
	const url = `https://dashboard:1515/games/${userID}`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			dispatcher: sslAgent
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

export async function fetchProfileDataBatch(log: any, userIDs: number[]): Promise<ProfileDataBatch[]> {
	if (!userIDs || userIDs.length === 0)
		return [];

	const url = 'https://users:2626/profiles';
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userIDs: userIDs }),
			dispatcher: sslAgent
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

export async function processMatches(log: any, userID: number): Promise<Matches[]> {
	const rawMatches = await fetchMatches(log, userID);

	if (rawMatches.length === 0)
		return [];

	const opponentMap = await fetchProfilesForMatches(log, rawMatches);


	const processedMatches = rawMatches.map(rawMatch => {
		const outcome = rawMatch.winnerID === userID ? "Win" : "Loss";
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

/*----------  WIP  ----------*/


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


function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return (`${mins}m ${secs}s`);
}



async function fetchProfilesForMatches(log: any, matches: RawMatches[]): Promise<Map<number, string>> {
	const opponentIDs = [...new Set(matches.map(match => match.opponentID))];

	if (opponentIDs.length === 0)
		return new Map();

	const usersData = await fetchProfileDataBatch(log, opponentIDs);

	const usernameMap = new Map<number, string>();
	for (const user of usersData)
		usernameMap.set(user.userID, user.username);

	return (usernameMap);
}




export async function fetchView(log: any, viewerID: number, targetID: number): Promise<ProfileView> {
	if (viewerID === targetID) {
		return 'self';
	}

	const url = `http://friends:1616/internal/friendships?userA=${viewerID}&userB=${targetID}`;
	let response: Response;

	try {
		response = await fetch(url);
	} catch (error) {
		log.error(`[BFF] Friends service (relationship) is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	if (!response.ok) {
		log.error(`[BFF] Friends service (relationship) failed: ${response.status}`);
		throw new Error('Friends service failed.');
	}

	const body = await response.json() as { status: ProfileView };
	return body.status || 'stranger';
}


/* export async function buildFullUserData(log: any, viewerUserID: number, targetUserID: number): Promise<userData> {
	const [
		accountData,
		profileData
	] = await Promise.all([
		fetchUserDataAccount(log, targetUserID),
		fetchProfileData(log, targetUserID)
	]);

	const relationship = await fetchView(log, viewerUserID, targetUserID);

	const combinedData: userData = {
		userID: accountData.userID,
		username: accountData.username,
		since: accountData.registerDate,
		language: accountData.defaultLang,
		status: profileData.userStatus,

		avatar: profileData.avatar,
		biography: profileData.biography,
		profileColor: profileData.profileColor,
		winstreak: profileData.winstreak,

		relation: relationship
	};

	return (combinedData);
} */

export async function updateAvatar(log: any, userID: number, avatar: string): Promise<void> {
	const url = `https://users:2626/internal/users/${userID}`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ avatar: avatar })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service reported a validation error for user ${userID}`);
		throw new Error('User validation failed.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for avatar update: ${userID}`);
		throw new Error('User not found in profile service.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return;
}

export async function updateBio(log: any, userID: number, biography: string): Promise<void> {
	const url = `http://users:2626/internal/users/${userID}`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ biography: biography })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service reported a validation error for user ${userID}`);
		throw new Error('User validation failed.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for biography update: ${userID}`);
		throw new Error('User not found in profile service.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return;
}

export async function updateProfileColor(log: any, userID: number, profileColor: string): Promise<void> {
	const url = `http://users:2626/internal/users/${userID}/profileColor`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ profileColor: profileColor })
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service reported a validation error for user ${userID}`);
		throw new Error('User validation failed.');
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for profileColor update: ${userID}`);
		throw new Error('User not found in profile service.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
	return;
}