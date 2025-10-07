// In account.service.ts
import { Database } from "sqlite";

/* export async function checkUsernameUnique(db: Database, username: string): Promise<boolean> {
    try {
		console.log('a');
        const query = `
            SELECT 1 FROM usersAuth WHERE username = ? LIMIT 1
        `;
		console.log('b');

        // 1. Pass parameters as an array
        const result = await db.all(query, [username]);
		console.log('c');
        
        // 2. Check the length of the result array
        // If length > 0, a user was found (username is taken)
        return result.length > 0;
    } catch (error) {
        console.error(`Error checking username availability for '${username}':`, error);
        throw error;
    }
} */

	export async function checkUsernameUnique(db: Database, username: string): Promise<boolean> {
    try {
        console.log('a');
        
        // --- ADD THIS LOG ---
        console.log('--- Inspecting db object ---');
        console.log(db);
        console.log('--- End Inspection ---');
        // --- END OF LOG ---

        const query = `
            SELECT 1 FROM usersAuth WHERE username = ? LIMIT 1
        `;
        console.log('b');

        const result = await db.get(query, username);
        console.log('c');
        
        return result.length > 0;
    } catch (error) {
        console.error(`Error checking username availability for '${username}':`, error);
        throw error;
    }
}