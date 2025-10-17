import * as types from './types-interfaces';

export const biographyPattern: string = '^[A-Za-z0-9\\s,\\.\\?!:\\)\\(\\/;\\-_]{0,256}$';
export const usernamePattern: string = '^[A-Za-z0-9_\\-]{4,18}$';
export const passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{12,64}$';

export const socialMenu: Array<types.buttonData> = [
    {
        content: null,
        type: 'button',
        img: {
            id: 'friendship',
            src: '/assets/icons/add-user.png',
            alt: 'a small pixel art blue blob with a green plus sign',
            size: 'ismall',
        },
        ariaLabel: 'Add user as friend',
    },
    {
        content: null,
        type: 'button',
        img: {
            id: 'challenge',
            src: '/assets/icons/challenge.png',
            alt: 'two overlapping pixel art ping pong paddles',
            size: 'ismall',
        },
        ariaLabel: 'Challenge user to a game',
    },
];

export const userDefault: types.UserData = {
    avatar: {
        id: 'user-avatar',
        src: '/assets/icons/magenta-avatar.png',
        alt: 'pp',
        size: 'imedium',
    },
    biography: '¯\\_(ツ)_/¯',
    relation: 'stranger',
    status: true,
    username: 'CrimeGoose',
    id: '256',
    winstreak: '7',
};

export const users: Array<types.UserData> = [
    userDefault,
    userDefault,
    userDefault,
    userDefault,
    userDefault,
    userDefault,
];

export const mainMenu: Array<types.buttonData> = [
    { content: 'Profile', type: 'button', img: null, ariaLabel: 'User Profile Menu Button' },
    { content: 'Play', type: 'button', img: null, ariaLabel: 'Pong Game Menu Button' },
    { content: 'Leaderboard', type: 'button', img: null, ariaLabel: 'Leaderboard Menu Button' },
];

export const gameMenu: Array<types.buttonData> = [
    { content: 'Local game', type: 'button', img: null, ariaLabel: 'Play a local game' },
    { content: 'Remote game', type: 'button', img: null, ariaLabel: 'Play a remote game' },
];

export const iMeta: types.ImgMetadata = {
    id: 'user-avatar',
    src: '/assets/icons/purple-avatar.png',
    alt: 'pp',
    size: 'imedium',
};

export const tabs: Array<types.TabMetadata> = [
    { id: 'history', content: 'Game history', default: true },
    { id: 'stats', content: 'Statistics', default: false },
    { id: 'friends', content: 'Friends', default: false },
];

export const textData: types.InputMetadata = {
    type: 'text',
    pattern: usernamePattern,
    id: 'username',
    placeholder: 'Enter your username!',
    labelContent: 'Username',
};

export const textArea: types.InputMetadata = {
    type: '',
    pattern: '',
    id: 'Biography',
    placeholder: 'Enter your biography',
    labelContent: 'Biography',
};

export const uploadData: types.InputMetadata = {
    type: 'file',
    pattern: '',
    id: 'upload',
    placeholder: 'Choose a file from your computer...',
    labelContent: 'Upload file',
};

export const pwData: types.InputMetadata = {
    type: 'password',
    pattern: passwordPattern,
    id: 'password',
    placeholder: 'Enter your password!',
    labelContent: 'Password',
};

export const slider: types.InputMetadata = {
    type: 'range',
    pattern: '',
    id: 'paddle-speed',
    placeholder: '',
    labelContent: 'Paddle speed',
    min: '0',
    max: '5',
    step: '1',
};
