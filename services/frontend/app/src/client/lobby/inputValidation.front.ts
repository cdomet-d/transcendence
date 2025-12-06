import Ajv, { type JSONSchemaType } from 'ajv';

interface ErrorMessage {
  error: string;
}

interface LobbyJoined {
  lobby: 'joined';
  lobbyID: string;
  formInstance: string;
}

interface LobbyCreated {
  lobby: 'created';
  lobbyID: string;
  formInstance: string;
}

interface GameRequest {
  opponent: string;
  gameID: string;
  remote: boolean;
  // gameSettings?: any;
}

type WSMessage = ErrorMessage | LobbyJoined | LobbyCreated | GameRequest;

const ajv = new Ajv({ discriminator: true });

const errorSchema: JSONSchemaType<ErrorMessage> = {
  type: 'object',
  properties: {
    error: { type: 'string' }
  },
  required: ['error'],
  additionalProperties: false
};

const lobbyJoinedSchema: JSONSchemaType<LobbyJoined> = {
  type: 'object',
  properties: {
    lobby: { type: 'string', const: 'joined' },
    lobbyID: { type: 'string' },
    formInstance: { type: 'string' }
  },
  required: ['lobby', 'lobbyID', 'formInstance'],
  additionalProperties: false
};

const lobbyCreatedSchema: JSONSchemaType<LobbyCreated> = {
  type: 'object',
  properties: {
    lobby: { type: 'string', const: 'created' },
    lobbyID: { type: 'string' },
    formInstance: { type: 'string' }
  },
  required: ['lobby', 'lobbyID', 'formInstance'],
  additionalProperties: false
};

const gameRequestSchema: JSONSchemaType<GameRequest> = {
  type: 'object',
  properties: {
    opponent: { type: 'string' },
    gameID: { type: 'string' },
    remote: { type: 'boolean' }
  },
  required: ['opponent', 'gameID', 'remote'],
  additionalProperties: false
};

const wsMessageSchema = {
  oneOf: [
    errorSchema,
    lobbyJoinedSchema,
    lobbyCreatedSchema,
    gameRequestSchema
  ]
};

const validateWSMessage = ajv.compile<WSMessage>(wsMessageSchema);

export { validateWSMessage, type WSMessage };
