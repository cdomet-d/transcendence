import * as types from './types-interfaces';

export const biographyPattern: string = '^[A-Za-z0-9\\s,\\.\\?!:\\)\\(\\/;\\-_]{0,256}$';
export const passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{12,64}$';
export const usernamePattern: string = '^[A-Za-z0-9_\\-]{4,18}$';

export const socialMenu: Array<types.buttonData> = [
    {
        ariaLabel: 'Add user as friend',
        content: null,
        type: 'button',
        img: {
            alt: 'a small pixel art blue blob with a green plus sign',
            id: 'friendship',
            size: 'ismall',
            src: '/assets/icons/add-user.png',
        },
    },
    {
        ariaLabel: 'Challenge user to a game',
        content: null,
        type: 'button',
        img: {
            alt: 'two overlapping pixel art ping pong paddles',
            id: 'challenge',
            size: 'ismall',
            src: '/assets/icons/challenge.png',
        },
    },
];

export const userDefault: types.UserData = {
    avatar: {
        alt: 'pp',
        id: 'user-avatar',
        size: 'ilarge',
        src: '/assets/icons/magenta-avatar.png',
    },
    biography: '¯\\_(ツ)_/¯',
    id: '256',
    relation: 'stranger',
    profileColor: 'bg-4F9FFF',
    language: 'English',
    status: true,
    username: 'CrimeGoose',
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
    { content: 'Leaderboard', type: 'button', img: null, ariaLabel: 'Leaderboard Menu Button' },
    { content: 'Play', type: 'button', img: null, ariaLabel: 'Pong Game Menu Button' },
    { content: 'Profile', type: 'button', img: null, ariaLabel: 'User Profile Menu Button' },
];

export const gameMenu: Array<types.buttonData> = [
    { content: 'Local game', type: 'button', img: null, ariaLabel: 'Play a local game' },
    { content: 'Remote game', type: 'button', img: null, ariaLabel: 'Play a remote game' },
];

export const userColorsMenu: Array<types.buttonData> = [
    {
        ariaLabel: '#hexcode color for profile customisation',
        content: '4F9FFF',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: '#hexcode color for profile customisation',
        content: '5200FF',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: '#hexcode color for profile customisation',
        content: '000080',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: '#hexcode color for profile customisation',
        content: '98A869',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: '#hexcode color for profile customisation',
        content: 'BE5103',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: '#hexcode color for profile customisation',
        content: 'CE4257',
        img: null,
        type: 'button',
    },
];

export const languageMenu: Array<types.buttonData> = [
    {
        ariaLabel: '#hexcode color for profile customisation',
        content: 'English',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: '#hexcode color for profile customisation',
        content: 'Spanish',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: '#hexcode color for profile customisation',
        content: 'French',
        img: null,
        type: 'button',
    },
];
export const iMeta: types.ImgMetadata = {
    alt: 'pp',
    id: 'user-avatar',
    size: 'imedium',
    src: '/assets/icons/purple-avatar.png',
};

export const tabs: Array<types.TabData> = [
    { id: 'friends', content: 'Friends', default: false },
    { id: 'history', content: 'Game history', default: true },
    { id: 'stats', content: 'Statistics', default: false },
];

export const textData: types.InputFieldsData = {
    id: 'username',
    labelContent: 'Username',
    pattern: usernamePattern,
    placeholder: 'Enter your username!',
    type: 'text',
};

export const textArea: types.InputFieldsData = {
    id: 'Biography',
    labelContent: 'Biography',
    pattern: '',
    placeholder: 'Enter your biography',
    type: '',
};

export const uploadData: types.InputFieldsData = {
    id: 'upload',
    labelContent: 'Upload file',
    pattern: '',
    placeholder: 'Choose a file from your computer...',
    type: 'file',
};

export const pwData: types.InputFieldsData = {
    id: 'password',
    labelContent: 'Password',
    pattern: passwordPattern,
    placeholder: 'Enter your password!',
    type: 'password',
};

export const slider: types.InputFieldsData = {
    id: 'paddle-speed',
    labelContent: 'Paddle speed',
    max: '5',
    min: '0',
    pattern: '',
    placeholder: '',
    step: '1',
    type: 'range',
};

//TODO: HTML froms don't support patch; must come up with a way to identify which POST are actually post and which are patch, to be handled in the server.
export const userSettingsForm: types.formDetails = {
    action: '/account/settings/CrimeGoose',
    ariaLabel: 'User settings',
    id: 'user-settings',
    method: 'post',
    fields: [
        {
            id: 'biography',
            labelContent: 'Biography',
            pattern: '',
            placeholder: 'Enter your biography',
            type: 'textarea',
        },
        {
            id: 'upload',
            labelContent: 'Avatar uploader',
            pattern: '',
            placeholder: '',
            type: 'file',
        },
        {
            id: 'username',
            labelContent: 'Username',
            pattern: usernamePattern,
            placeholder: 'Enter your new username!',
            type: 'text',
        },
        {
            id: 'password',
            labelContent: 'Password',
            pattern: passwordPattern,
            placeholder: 'Enter your new password!',
            type: 'password',
        },
    ],
    button: { type: 'submit', content: 'submit', img: null, ariaLabel: '' },
};
