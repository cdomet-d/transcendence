export type ProfileCreationResult =
	| { errorCode: 'success'; data: any }
	| { errorCode: 'conflict' }  // For 409
	| { errorCode: 'user_not_found' }; // For 404

export interface JwtPayload {
    userID: string;
    username: string;
    iat: number;
    exp: number;
	version: number;
	action?: boolean;
	role?: string;
}
