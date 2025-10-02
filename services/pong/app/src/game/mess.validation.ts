import { Ajv }  from 'ajv';

export interface keysObj {
    _w: boolean,
    _s: boolean,
    _ArrowUp: boolean,
    _ArrowDown: boolean,
    [key: string]: boolean,
}

export interface messObj {
    _keys: keysObj,
    _timeStamp: number,
}

const messObjSchema = {
    type: 'object',
    required: ['_keys', '_timeStamp'],
    properties: {
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
export const validMess = ajv.compile(messObjSchema);
