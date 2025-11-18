import type { repObj, coordinates } from './classes/game.interfaces.js';

const coordSchema = {
    type: 'object',
    additionalProperties: { type: 'number' },
    required: ['x', 'y'],
    properties: { x: { type: 'number' }, y: { type: 'number' } },
};

const repObjSchema = {
    type: 'object',
    required: ['_ID', '_timestamp', '_leftPad', '_rightPad', '_ball', '_score'],
    properties: {
        _ID: 'number',
        _timestamp: 'number',
        _leftPad: coordSchema,
        _rightPad: coordSchema,
        _ball: coordSchema,
        // _score:
    },
};

export function validRep(rep: repObj): boolean {
    if (typeof rep !== repObjSchema.type) return false;
    for (const element of repObjSchema.required) {
        if (!Object.hasOwn(rep, element)) return false;
    }
    for (const coord of Object.values(rep)) {
        if (!validCoord(coord)) return false;
    }
    return true;
}

function validCoord(obj: coordinates): boolean {
    if (typeof obj !== coordSchema.type) return false;
    for (const element of coordSchema.required) {
        if (!Object.hasOwn(obj, element)) return false;
    }
    const properties = coordSchema.properties;
    for (const key in obj) {
        const prop = key as keyof typeof properties;
        if (typeof obj[key] != properties[prop].type) return false;
    }
    return true;
}
