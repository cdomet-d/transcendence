import { Ajv }  from 'ajv';

export interface keysObj {
    _w: boolean,
    _s: boolean,
    _ArrowUp: boolean,
    _ArrowDown: boolean,
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
            required: ['_w', '_s', '_ArrowUp', '_ArrowDown'],
            properties: {
                _w: { type: 'boolean' },
                _s: { type: 'boolean' },
                _ArrowUp: { type: 'boolean' },
                _ArrowDown: { type: 'boolean' },
            }
        }
    }
};

const ajv = new Ajv();

export const validMess = ajv.compile(reqObjSchema);

export const validIds = ajv.compile(idsObjSchema);
