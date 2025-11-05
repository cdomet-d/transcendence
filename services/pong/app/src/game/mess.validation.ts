import { Ajv } from 'ajv';

export interface keysObj {
	_w: boolean,
	_s: boolean,
    _a: boolean,
    _d: boolean,
	_ArrowUp: boolean,
	_ArrowDown: boolean,
    _ArrowLeft: boolean,
    _ArrowRight: boolean,
	[key: string]: boolean,
}

export interface reqObj {
    _ID: number,
    _keys: keysObj,
    _timeStamp: number,
}

export interface idsObj {
	gameID: number,
	userID: number
}

const idsObjSchema = {
	type: 'object',
	required: ['gameID', 'userID'],
	properties: {
		gameID: { type: 'number' },
		userID: { type: 'number' },
	}
}

const reqObjSchema = {
    type: 'object',
    required: ['_ID', '_keys', '_timeStamp'],
    properties: {
        _ID: { type: 'number' },
        _timeStamp: { type: 'number' },
        _keys: {
            type: 'object',
            additionalProperties: { type: 'boolean' },
            required: ['_w', '_s', '_a', '_d', '_ArrowUp', '_ArrowDown', '_ArrowLeft', '_ArrowRight'],
            properties: {
                _w: { type: 'boolean' },
                _s: { type: 'boolean' },
                _a: { type: 'boolean' },
                _d: { type: 'boolean' },
                _ArrowUp: { type: 'boolean' },
                _ArrowDown: { type: 'boolean' },
                _ArrowLeft: { type: 'boolean' },
                _ArrowRight: { type: 'boolean' },
            }
        }
    }
};

const ajv = new Ajv();

export const validRequest = ajv.compile(reqObjSchema);

export const validIds = ajv.compile(idsObjSchema);
