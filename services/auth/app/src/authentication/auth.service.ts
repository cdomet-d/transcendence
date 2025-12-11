import { Database } from 'sqlite';
import jwt from 'jsonwebtoken';
import type { ProfileCreationResult } from './auth.interfaces.js';
import type { FastifyInstance, FastifyReply } from 'fastify';
import * as bcrypt from 'bcrypt';

export async function createUserProfile(log: any, userID: string, username: string): Promise<ProfileCreationResult> {
	const url = `http://nginx:80/api/users/${userID}`;

	//const body = JSON.stringify({ username: username });
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username }),
		});
	} catch (error) {
		log.error(`[AUTH] User service (via NGINX) is unreachable: ${error}`);
		throw new Error(`Profile service failed with status`);
	}

	if (response.status === 409) {
		log.warn(`[AUTH] Username already taken for profile creation`);
		let message = 'Username or userID is already taken.';
		try {
			const errorBody = (await response.json()) as { message: string };
			if (errorBody.message) message = errorBody.message;
			return { errorCode: 'conflict' };
		} catch (error) {}
		return { errorCode: 'conflict' };
	}

	if (!response.ok) {
		log.warn(`[AUTH] User service failed with status ${response.status}`);
		throw new Error(`Profile service failed with status ${response.status}`);
	}

	const data = await response.json();
	return { errorCode: 'success', data: data };
}

export async function updateStatus(log: any, userID: string, status: boolean, token: string) {
	const url = `http://nginx:80/api/users/${userID}`;

	try {
		let response: Response;
		response = await fetch(url, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json', Cookie: `token=${token}` },
			body: JSON.stringify({ status: status, lastConnexion: new Date().toISOString() }),
		});
	} catch (err) {}
}

export async function checkUsernameUnique(db: Database, username: string): Promise<boolean> {
	try {
		const query = `
			SELECT 1 FROM account WHERE username = ? LIMIT 1
		`;
		const response = await db.all(query, username);

		//true == username taken, false == username available
		return response.length > 0;
	} catch (error) {
		console.log(`[AUTH] Error fetching username availability for  ${username}: `, error);
		throw error;
	}
}

export async function deleteAccount(db: Database, log: any, userID: string): Promise<boolean> {
	try {
		const query = `DELETE FROM account WHERE userID = ?`;

		const result = await db.run(query, [userID]);
		if (!result.changes) return false;
		return true;
	} catch (error) {
		log.error(`[AUTH] Error deleting account: ${error}`);
		return false;
	}
}

export function extractAuthHeader(authorization?: string): string | undefined {
	if (!authorization) return undefined;
	const token = authorization.replace(/^Bearer\s+/i, '');
	return token;
}

export function validateBearerToken(serv: FastifyInstance, authorization?: string): boolean {
	const token = extractAuthHeader(authorization);
	serv.log.warn(token);
	if (!token) return false;
	serv.log.warn('Exists');
	try {
		jwt.verify(token, process.env.JWT_SECRET!);
		return true;
	} catch (error) {
		if (error instanceof Error) serv.log.warn(error.message);
		return false;
	}
}

export function setCookie(reply: FastifyReply, token: string) {
	reply.setCookie('token', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		path: '/',
		maxAge: 60 * 60 * 1000,
	});
}

export function clearCookie(reply: FastifyReply) {
	reply.clearCookie('token', {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		path: '/',
		maxAge: 60 * 60 * 1000,
	});
}

export async function verifyPasswordMatch(serv: FastifyInstance, username: string, password: string): Promise<any> {
	try {
		const query = `
				SELECT userID, hashedPassword FROM account WHERE username = ?
			`;

		const account = await serv.dbAuth.get(query, [username]);
		if (!account) return 404;

		const passwordMatches = await bcrypt.compare(password, account.hashedPassword);
		if (!passwordMatches) return 401;

		return account;
	} catch (error) {
		serv.log.error(`[AUTH] An unexpected error occurred while login: ${error}`);
		throw error;
	}
}

export async function checkJWTVersion(serv: FastifyInstance, userID: string, extractedVersion: number): Promise<any> {
	try {
		let version: number = await getJWTVersion(serv, userID);
		if (version !== extractedVersion) return 401;
		return 200;
	} catch (error) {
		throw error;
	}
}

export async function updateJWTVersion(serv: FastifyInstance, userID?: string): Promise<any> {
	try {
		let version: number = await getJWTVersion(serv, userID);
		version += 1;
		const setJWTquery = `UPDATE account SET JWTVersion = ? WHERE userID = ?;`;
		await serv.dbAuth.run(setJWTquery, [version, userID]);
		return version;
	} catch (error) {
		throw error;
	}
}

export async function getJWTVersion(serv: FastifyInstance, userID?: string, username?: string): Promise<any> {
	try {
		let version;
		if (userID) {
			const query = `SELECT JWTVersion FROM account WHERE userID = ?;`;
			version = await serv.dbAuth.get(query, [userID]);
		} else if (username) {
			const query = `SELECT JWTVersion FROM account WHERE username = ?;`;
			version = await serv.dbAuth.get(query, [username]);
		}
		if (!version) throw new Error('Could not get token version');
		return version.JWTVersion;
	} catch (error) {
		throw error;
	}
}
