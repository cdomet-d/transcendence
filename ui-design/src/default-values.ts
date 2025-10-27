import * as types from './types-interfaces';

export const biographyPattern: string = '^[A-Za-z0-9\\s,\\.\\?!:\\)\\(\\/\\-_]{0,256}$';
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

export const user: types.UserData = {
    avatar: {
        alt: 'pp',
        id: 'user-avatar',
        size: 'ilarge',
        src: '/assets/icons/magenta-avatar.png',
    },
    biography: '(╯°□°)╯︵ ┻━┻',
    id: '256',
    relation: 'stranger',
    profileColor: 'bg-4F9FFF',
    language: 'English',
    status: true,
    username: 'CrimeGoose',
    winstreak: '7',
    since: '145',
};

export const players: types.matchParticipants = {
    player1: {
        avatar: {
            alt: 'pp',
            id: 'user-avatar',
            size: 'iicon',
            src: '/assets/icons/magenta-avatar.png',
        },
        biography: '(╯°□°)╯︵ ┻━┻',
        id: '256',
        relation: 'stranger',
        profileColor: 'bg-CE4257',
        language: 'English',
        status: true,
        username: 'CrimeGoose',
        winstreak: '7',
        since: '145',
    },
    player2: {
        avatar: {
            alt: 'pp',
            id: 'user-avatar',
            size: 'iicon',
            src: '/assets/icons/light-green-avatar.png',
        },
        biography: '>:)',
        id: '64',
        relation: 'stranger',
        profileColor: 'bg-98A869',
        language: 'English',
        status: true,
        username: 'ElGuapo',
        winstreak: '4',
        since: '35',
    },
};

export const users: Array<types.UserData> = [user, user, user, user, user, user];

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
export const iMeta: types.ImgData = {
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
    required: false,
};

export const textArea: types.InputFieldsData = {
    id: 'Biography',
    labelContent: 'Biography',
    pattern: '',
    placeholder: 'Enter your biography',
    type: '',
    required: false,
};

export const uploadData: types.InputFieldsData = {
    id: 'upload',
    labelContent: 'Upload file',
    pattern: '',
    placeholder: 'Choose a file from your computer...',
    type: 'file',
    required: false,
};

export const pwData: types.InputFieldsData = {
    id: 'password',
    labelContent: 'Password',
    pattern: passwordPattern,
    placeholder: 'Enter your password!',
    type: 'password',
    required: false,
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
    required: false,
};

//TODO: HTML froms don't support patch must come up with a way to identify which POST are actually post and which are patch, to be handled in the server.
export const userSettingsForm: types.formDetails = {
    action: '/account/settings/CrimeGoose',
    heading: 'Settings',
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
            required: false,
        },
        {
            id: 'upload',
            labelContent: 'Avatar uploader',
            pattern: '',
            placeholder: '',
            type: 'file',
            required: false,
        },
        {
            id: 'username',
            labelContent: 'Username',
            pattern: usernamePattern,
            placeholder: 'Enter your new username!',
            type: 'text',
            required: false,
        },
        {
            id: 'password',
            labelContent: 'Password',
            pattern: passwordPattern,
            placeholder: 'Enter your new password!',
            type: 'password',
            required: false,
        },
    ],
    button: { type: 'submit', content: 'submit', img: null, ariaLabel: '' },
};

export const registrationForm: types.formDetails = {
    action: '/account',
    heading: 'Register',
    ariaLabel: 'Create an account',
    id: 'account-create',
    method: 'post',
    fields: [
        {
            id: 'username',
            labelContent: 'Username',
            pattern: usernamePattern,
            placeholder: 'Enter your username!',
            type: 'text',
            required: true,
        },
        {
            id: 'password',
            labelContent: 'Password',
            pattern: passwordPattern,
            placeholder: 'Enter your password!',
            type: 'password',
            required: false,
        },
    ],
    button: { type: 'submit', content: 'submit', img: null, ariaLabel: '' },
};

export const search: types.formDetails = {
    action: '/search',
    heading: '',
    ariaLabel: 'Search for a user',
    id: 'searchform',
    method: 'get',
    fields: [
        {
            id: 'searchbar',
            labelContent: 'Searchbar',
            pattern: '',
            placeholder: 'Search...',
            type: 'text',
            required: false,
        },
    ],
    button: { type: 'submit', content: 'Search', img: null, ariaLabel: '' },
};

export const emptyForm: types.formDetails = {
    action: '',
    ariaLabel: '',
    button: { type: 'button', content: '', img: null, ariaLabel: '' },
    fields: [],
    heading: '',
    id: '',
    method: '',
};

export const defaultMatchOut: types.inlineMatchResult = {
    date: '24.10.2025',
    opponent: 'DumbCamel',
    outcome: 'Win',
    score: '5-3',
    duration: "2'53",
};

export const tournament: types.matchParticipants[] = [players, players, players, players];
