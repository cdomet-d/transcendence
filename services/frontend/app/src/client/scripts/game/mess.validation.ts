import type { ballObj } from "./game.class.js";

export interface coordinates {
	x: number,
	y: number,
	[key: string]: number,
}

export interface repObj {
	_ID: number,
	_timestamp: number,
	_leftPad: coordinates,
	_rightPad: coordinates,
	_ball: ballObj,
}

export interface startObj {
	clientTimeStamp: number,
	serverTimeStamp: number,
	delay: number,
	ballDir: number,
}

const coordSchema = {
	type: 'object',
	additionalProperties: { type: 'number' },
	required: ['x', 'y'],
	properties: {
		x: { type: 'number' },
		y: { type: 'number' },
	},
};

const repObjSchema = {
	type: 'object',
	required: ['ID', 'leftPad', 'rightPad', 'ball'],
	properties: {
		ID: 'number',
		leftPad: coordSchema,
		rightPad: coordSchema,
		ball: coordSchema,
	}
}

export function validRep(rep: repObj): boolean {
	if (typeof rep !== repObjSchema.type)
		return false;
	for (const element of repObjSchema.required) {
		if (!Object.hasOwn(rep, element))
			return false;
	}
	for (const coord of Object.values(rep)) {
		if (!validCoord(coord))
			return false;
	}
	return true;
}

function validCoord(obj: coordinates): boolean {
	if (typeof obj !== coordSchema.type)
		return false;
	for (const element of coordSchema.required) {
		if (!Object.hasOwn(obj, element))
			return false;
	}
	const properties = coordSchema.properties;
	for (const key in obj) {
		const prop = key as keyof typeof properties; 
		if (typeof obj[key] != properties[prop].type)
			return false;
	}
	return true;
}