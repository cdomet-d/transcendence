import type { Matches } from './bff.interface.js';


export async function fetchMatches (userID: number): Promise< Matches[] > {

	const response = await fetch(``);
	
	return (response.json() as Promise<Matches[]>);
	
}