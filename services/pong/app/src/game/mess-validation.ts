import { Ajv } from 'ajv';

const idsObjSchema = {
	type: 'object',
	required: ['gameID', 'userID'],
	properties: {
		gameID: { type: 'string' },
		userID: { type: 'string' },
	}
}

const reqObjSchema = {
    type: 'object',
    required: ['ID', 'keys', 'timeStamp'],
    properties: {
        ID: { type: 'number' },
        timeStamp: { type: 'number' },
        keys: {
            type: 'object',
            additionalProperties: { type: 'boolean' },
            required: ['w', 's', 'a', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
            properties: {
                w: { type: 'boolean' },
                s: { type: 'boolean' },
                a: { type: 'boolean' },
                d: { type: 'boolean' },
                ArrowUp: { type: 'boolean' },
                ArrowDown: { type: 'boolean' },
                ArrowLeft: { type: 'boolean' },
                ArrowRight: { type: 'boolean' },
            }
        }
    }
};

const ajv = new Ajv();

export const validRequest = ajv.compile(reqObjSchema);

export const validIds = ajv.compile(idsObjSchema);
