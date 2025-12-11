import type { FastifyReply } from 'fastify';
import type {
	UsernameResponse, FriendshipStatus, Friendship, ProfileView, userStats, StatsResponse, Matches, RawMatches,
	userData, UserIDResponse, UserProfileUpdates, UserProfileView
} from "../utils/bff.interface.js";


export async function fetchFullUserProfile(
	log: any,
	requesterID: string,
	targetUsername: string,
	token: string
): Promise<UserProfileView> {

	const combinedUserData = await buildTinyProfile(log, requesterID, targetUsername, token);

	if (!combinedUserData)
		throw { code: 404, message: 'User profile data not found.' };

	const [userData, userStats, friends, pending, recentMatches] = await Promise.all([
		combinedUserData,
		fetchUserStats(log, combinedUserData.userID, token),
		fetchFriendships(log, combinedUserData.userID, 'friend', token),
		fetchFriendshipsPending(log, combinedUserData.userID, 'pending', token),
		processMatches(log, combinedUserData.userID, token),
	]);

	if (!userData || !userStats)
		throw { code: 404, message: '[BFF] Failed to retrieve essential user data.' };

	const responseData: UserProfileView = {
		userData: userData,
		userStats: userStats,
		friends: friends || [],
		pending: pending || [],
		matches: recentMatches || [],
	};

	return (responseData);
}

//error handled
export async function buildTinyProfile(
	log: any,
	viewerUserID: string,
	targetUsername: string,
	token: string
): Promise<userData> {
	try {
		const targetUserID = await fetchUserID(log, targetUsername, token);

		if (!targetUserID) {
			log.warn(`[BFF] buildTinyProfile: UserID not found for ${targetUsername}`);
			throw { code: 404, message: '[BFF] User not found.' };
		}

		const [data, relation] = await Promise.all([
			fetchUserData(log, targetUserID, token),
			fetchProfileView(log, viewerUserID, targetUserID, token),
		]);

		if (!data) {
			log.warn(`[BFF] buildTinyProfile: Data not found for userID ${targetUserID}`);
			throw { code: 404, message: '[BFF] User not found.' };
		}

		return {
			userID: targetUserID,
			username: data.username,
			avatar: data.avatar,
			biography: data.biography,
			profileColor: data.profileColor,
			since: data.since,
			status: data.status,
			winStreak: data.winStreak,
			totalLosses: data.totalLosses,
			totalWins: data.totalWins,
			lang: data.lang,
			relation: relation,
		};
	} catch (error) {
		if (typeof error === 'object' && error !== null && 'code' in error) {
			const customError = error as { code: number; message: string };

			if (customError.code === 404)
				throw { code: 404, message: customError.message || '[BFF] User not found.' };
			if (customError.code === 400)
				throw { code: 400, message: customError.message || '[BFF] Unauthorized' };
			if (customError.code === 401)
				throw { code: 401, message: customError.message || '[BFF] Unauthorized' };
		}
		throw error;
	}
}

//error handled
export async function searchBar(log: any, username: string, token: string): Promise<userData[]> {
	const url = `http://users:2626/search?name=${username}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		log.error(`[BFF] User service (search) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service validation error for user ${username}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not search.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] User service validation error for user ${username}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not search.' };
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

//error handled
export async function fetchUserData(
	log: any,
	userID: string,
	token: string
): Promise<userData | null> {
	const url = `http://users:2626/${userID}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		log.error(`[BFF] User service (userData) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not fetch userdata' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not fetch userdata' };
	}

	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 404, message: errorBody.message || '[BFF] User not found.' };
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

export async function fetchProfileView(log: any, userID: string, targetUserID: string, token: string): Promise<ProfileView> {

	if (targetUserID === userID)
		return ('self');

	let response: Response;
	const friendsUrl = `http://friends:1616/friendship?userA=${userID}&userB=${targetUserID}`;

	try {
		response = await fetch(friendsUrl, {
			method: 'GET',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		log.error(`[BFF] Friends service is unreachable: ${error}`);
		return 'stranger';
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw {
			code: 400,
			message: errorBody.message || '[BFF] Could not fetch relation for profileView',
		};
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw {
			code: 401,
			message: errorBody.message || '[BFF] Could not fetch relation for profileView',
		};
	}

	if (!response.ok) {
		log.error(`[BFF] Friends service failed with status ${response.status}`);
		return 'stranger';
	}

	const friendshipData = (await response.json()) as { status: ProfileView };
	return friendshipData.status;
}

//error handled
export async function fetchUserID(
	log: any,
	username: string,
	token: string
): Promise<string | null> {
	const url = `http://users:2626/userID/${username}`;

	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		log.error(`[BFF] User service (userID) is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not fetch userID.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not fetch userID.' };
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

//error handled
export async function fetchUserStats(
	log: any,
	userID: string,
	token: string
): Promise<userStats | null> {
	const url = `http://users:2626/stats/${userID}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not fetch user stats.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not fetch user stats.' };
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
//error handled
export async function fetchFriendships(
	log: any,
	userID: string,
	status: FriendshipStatus,
	token: string
): Promise<userData[]> {
	const url = `http://friends:1616/friendlist?userID=${userID}`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		log.error(`[BFF] Friends service is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not friendlist.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not friendlist.' };
	}

	if (!response.ok) {
		log.error(`[BFF] Friends service failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}

	const friendships = (await response.json()) as Friendship[];

	const targetIsAccepted = status === 'friend';

	const filteredList = friendships.filter((f) => {
		const isAccepted =
			String(f.statusFriendship) === 'true' || String(f.statusFriendship) === '1';

		return isAccepted === targetIsAccepted;
	});

	const profilePromises = filteredList.map(async (friendship) => {
		try {
			const otherID = friendship.userID === userID ? friendship.friendID : friendship.userID;

			const profile = await fetchUserData(log, String(otherID), token);

			if (profile) {
				(profile as any).relation = status;
				profile.since = friendship.startTime;
			}
			return profile;
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number; message: string };
				if (customError.code === 404) {
					const errorBody = (await response.json()) as { message: string };
					throw {
						code: 404,
						message: errorBody.message || '[BFF] Could not friendlist.',
					};
				}

				if (response.status === 400) {
					log.warn(`[BFF] Auth service validation error`);
					const errorBody = (await response.json()) as { message: string };
					throw { code: 400, message: errorBody.message || '[BFF] Unauthorized.' };
				}

				if (response.status === 401) {
					log.warn(`[BFF] Auth service validation error`);
					const errorBody = (await response.json()) as { message: string };
					throw { code: 401, message: errorBody.message || '[BFF] Unauthorized.' };
				}

				log.warn(`[BFF] Could not fetch profile for user ${friendship.friendID}`);
				return null;
			}
		}
	});

	const profiles = await Promise.all(profilePromises);

	return profiles.filter((p): p is userData => p !== null);
}

export async function fetchFriendshipsPending(log: any, userID: string, status: FriendshipStatus, token: string): Promise<userData[]> {
	const url = `http://friends:1616/friendlistpending?userID=${userID}`;
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

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = await response.json() as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not friendlist.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = await response.json() as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not friendlist.' };
	}

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

			const profile = await fetchUserData(log, String(otherID), token);

			if (profile) {
				(profile as any).relation = status;
				profile.since = friendship.startTime;
			}
			return (profile);
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const customError = error as { code: number, message: string };
				if (customError.code === 404) {
					const errorBody = await response.json() as { message: string };
					throw { code: 404, message: errorBody.message || '[BFF] Could not friendlist.' };
				}

				if (response.status === 400) {
					log.warn(`[BFF] Auth service validation error`);
					const errorBody = await response.json() as { message: string };
					throw { code: 400, message: errorBody.message || '[BFF] Unauthorized.' };
				}

				if (response.status === 401) {
					log.warn(`[BFF] Auth service validation error`);
					const errorBody = await response.json() as { message: string };
					throw { code: 401, message: errorBody.message || '[BFF] Unauthorized.' };
				}

				log.warn(`[BFF] Could not fetch profile for user ${friendship.friendID}`);
				return (null);
			}
		}
	});

	const profiles = await Promise.all(profilePromises);

	return profiles.filter((p): p is userData => p !== null);
}

//error handled
async function fetchMatches(log: any, userID: string, token: string): Promise<RawMatches[]> {
	const url = `http://dashboard:1515/games/${userID}`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not fetch matches.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not fetch matches.' };
	}

	if (response.status === 404) {
		log.warn(`[BFF] User data not found for user ${userID}`);
		throw new Error('User data not found.');
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}

	return response.json() as Promise<RawMatches[]>;
}

//error handled
async function fetchUsernames(
	log: any,
	userIDs: string[],
	token: string
): Promise<Map<string, string>> {
	if (userIDs.length === 0) return new Map();
	const url = `http://users:2626/usernames`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'POST',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userIDs: userIDs }),
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw {
			code: 400,
			message: errorBody.message || '[BFF] Could not fetch usernames for game opponent.',
		};
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw {
			code: 401,
			message: errorBody.message || '[BFF] Could not fetch usernames for game opponent.',
		};
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service error.');
	}

	const body = (await response.json()) as UsernameResponse;

	const usernameMap = new Map<string, string>();

	if (body.usersNames) {
		for (const user of body.usersNames) usernameMap.set(user.userID, user.username);
	}

	return usernameMap;
}

function formatMatchDate(dateStr: string): string {
	if (!dateStr) return 'N/A';

	let safeDateStr = dateStr;
	if (dateStr.includes('T') && !dateStr.includes(':')) {
		safeDateStr = dateStr.replace(
			/T(\d{2})(\d{2})(\d{2})(\d+)?Z/,
			(match, h, m, s, ms) => `T${h}:${m}:${s}${ms ? '.' + ms : ''}Z`
		);
	}

	const date = new Date(safeDateStr);

	return date.toLocaleString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

//error handled
export async function processMatches(log: any, userID: string, token: string): Promise<Matches[]> {
	try {
		const rawMatches = await fetchMatches(log, userID, token);

		if (!rawMatches || rawMatches.length === 0) return [];

		const opponentIDs = new Set<string>();
		rawMatches.forEach((match) => {
			const opponentID = match.player1 === userID ? match.player2 : match.player1;
			opponentIDs.add(opponentID);
		});

		const opponentMap = await fetchUsernames(log, Array.from(opponentIDs), token);

		const processedMatches = rawMatches.map((rawMatch) => {
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

			const opponentName = opponentMap.get(opponentID) || 'John Doe';

			const isTournament = rawMatch.tournamentID > 0;
			let tournamentFront = ""; 
			if (isTournament === false)
				tournamentFront = "no";
			else
				tournamentFront === JSON.stringify(rawMatch.tournamentID);


			const match: Matches = {
				date: formatMatchDate(rawMatch.startTime),
				opponent: opponentName,
				outcome: outcome,
				score: scoreString,
				duration: formatDuration(rawMatch.duration),
				tournament: tournamentFront,
			};
			return match;
		});

		return processedMatches;
	} catch (error) {
		if (typeof error === 'object' && error !== null && 'code' in error) {
			const customError = error as { code: number; message: string };
			if (customError.code === 404) {
				log.warn(`[BFF] Could no find user`);
				throw { code: 404, message: '[BFF] Could not find user.' };
			}

			if (customError.code === 400) {
				log.warn(`[BFF] Auth service validation error`);
				throw { code: 400, message: '[BFF] Unauthorized.' };
			}

			if (customError.code === 401) {
				log.warn(`[BFF] Auth service validation error`);
				throw { code: 401, message: '[BFF] Unauthorized.' };
			}
		}
		throw error;
	}
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}m ${secs}s`;
}

//error handled
export async function fetchLeaderboard(log: any, token: string): Promise<userData[]> {
	const url = `http://users:2626/leaderboard`;
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not fetch leaderboard.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not fetch leaderboard.' };
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service error.');
	}

	const body = (await response.json()) as { success: boolean; profiles: userData[] };

	if (!body.success || !body.profiles) {
		log.error(`[BFF] User service (search) returned 200 OK but with a failure body.`);
		throw new Error('User service returned invalid data.');
	}

	return body.profiles;
}

//error handled
export async function updateUserProfile(
	log: any,
	userID: string,
	updates: UserProfileUpdates,
	token: string
): Promise<void> {
	const url = `http://users:2626/${userID}`;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updates),
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 409) {
		log.warn(`[BFF] Username taken in user service change for user: ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 409, message: errorBody.message || '[BFF] Username taken' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] User service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not change settings.' };
	}
	if (response.status === 400) {
		log.warn(`[BFF] User service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not change settings.' };
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for update: ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 404, message: errorBody.message || '[BFF] User not found.' };
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('[BFF] User service failed.');
	}
}

export async function updateUserProfileUsername(
	log: any,
	userID: string,
	updates: UserProfileUpdates,
	token: string
): Promise<void> {
	const url = `http://users:2626/${userID}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updates),
		});
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}

	if (response.status === 409) {
		log.warn(`[BFF] Username taken in user service change for user: ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 409, message: errorBody.message || '[BFF] Username taken' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] User service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not change settings.' };
	}
	if (response.status === 400) {
		log.warn(`[BFF] User service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not change settings.' };
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for update: ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 404, message: errorBody.message || '[BFF] User not found.' };
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('[BFF] User service failed.');
	}
}

//error handling done
export async function updateAuthSettings(
	log: any,
	userID: string,
	updates: UserProfileUpdates,
	token: string
): Promise<void> {
	const url = `http://auth:3939/${userID}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updates),
		});
	} catch (error) {
		log.error(`[BFF] Auth service is unreachable: ${error}`);
		throw new Error('Auth service is unreachable.');
	}

	if (response.status === 409) {
		log.warn(`[BFF] Username taken in auth service change for user: ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 409, message: errorBody.message || '[BFF] Username taken' };
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not change settings.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not change settings.' };
	}

	if (response.status === 404) {
		log.warn(`[BFF] Account not found for update: ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 404, message: errorBody.message || '[BFF] User not found.' };
	}

	if (!response.ok) {
		log.error(`[BFF] Auth service failed with status ${response.status}`);
		throw new Error('Auth service failed.');
	}
}

export async function refreshJWTForUsernameChange(
	auth: string | undefined,
	userID: string,
	username: string,
	reply: FastifyReply
) {
	if (!auth) throw { code: 401, message: '[AUTH] Missing Authorization Header for JWT refresh' };
	const url = 'http://auth:3939/regen-jwt';
	const req: RequestInit = {
		headers: { Authorization: `${auth}`, 'Content-Type': 'application/json' },
		method: 'POST',
		body: JSON.stringify({
			username: username,
			userID: userID,
		}),
	};

	const res = await fetch(url, req);
	if (!res.ok)
		throw {
			code: 401,
			message: '[AUTH] Could not refresh cookie after username change - rolling back...',
		};
	const body = (await res.json()) as { token: string };
	reply.setCookie('token', body.token, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		path: '/',
		maxAge: 60 * 60 * 1000,
	});
}

export async function deleteAllFriendship(log: any, userID: string, token: string) {
	const url = `http://friends:1616/`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Cookie: `token=${token}`,
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		});
	} catch (error) {
		log.error(`[BFF] Friends service is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] Friends service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not delete friendlist.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Friends service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not delete friendlist.' };
	}

	if (!response.ok) {
		log.error(`[BFF] Friends service failed with status ${response.status}`);
		throw new Error('Friends service failed.');
	}
}

export async function AnonymizeUser(log: any, userID: string, token: string) {
	const url = `http://users:2626/anonymize`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: {
				Cookie: `token=${token}`,
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userID })
		});
	} catch (error) {
		log.error(`[BFF] DUser service is unreachable: ${error}`);
		throw new Error('Friends service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] User service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not delete profile.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] User service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not delete profile.' };
	}

	if (response.status === 404) {
		log.warn(`[BFF] User not found for update: ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 404, message: errorBody.message || '[BFF] User not found.' };
	}

	if (!response.ok) {
		log.error(`[BFF] User service failed with status ${response.status}`);
		throw new Error('User service failed.');
	}
}

export async function AnonymizeAccount(log: any, userID: string, token: string) {
	const url = `http://auth:3939/anonymize`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'PATCH',
			headers: {
				Cookie: `token=${token}`,
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userID })
		});
	} catch (error) {
		log.error(`[BFF] Auth service is unreachable: ${error}`);
		throw new Error('Auth service is unreachable.');
	}

	if (response.status === 400) {
		log.warn(`[BFF] Auth service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 400, message: errorBody.message || '[BFF] Could not delete account.' };
	}

	if (response.status === 401) {
		log.warn(`[BFF] Auth service validation error for user ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 401, message: errorBody.message || '[BFF] Could not delete account.' };
	}

	if (response.status === 404) {
		log.warn(`[BFF] Account not found for update: ${userID}`);
		const errorBody = (await response.json()) as { message: string };
		throw { code: 404, message: errorBody.message || '[BFF] Account not found.' };
	}

	if (!response.ok) {
		log.error(`[BFF] Auth service failed with status ${response.status}`);
		throw new Error('Auth service failed.');
	}
}