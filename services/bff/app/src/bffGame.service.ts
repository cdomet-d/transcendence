import type { Matches } from './bff.interface.js';

// GET
export async function fetchMatches (userID: number): Promise< Matches[] | null> {
	const response = await fetch(`/internal/dashboard/${userID}/gameHistory`);
	if (response.status == 404)
		return (null);
	if (!response.ok)
		throw (new Error('Dashboard service failed.'));
	return (response.json() as Promise<Matches[]>);
}