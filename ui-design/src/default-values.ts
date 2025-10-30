import * as types from './types-interfaces';

export const biographyPattern: string = '^[A-Za-z0-9\\s,\\.\\?!:\\)\\(\\/\\-_]{0,256}$';
export const passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{12,64}$';
export const usernamePattern: string = '^[A-Za-z0-9_\\-]{4,18}$';

export const socialMenu: types.buttonData[] = [
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

export const u1: types.UserData = {
    avatar: {
        alt: 'pp',
        id: 'user-avatar',
        size: 'iicon',
        src: '/assets/icons/magenta-avatar.png',
    },
    biography: '(╯°□°)╯︵ ┻━┻',
    id: '256',
    relation: 'stranger',
    profileColor: 'bg-BE5103',
    language: 'English',
    status: true,
    username: 'm4p1',
    winstreak: '7',
    since: '145',
};

export const users: Array<types.UserData> = [user, u1, user, user, u1, user];
export const u2: Array<types.UserData> = [u1, u1];

export const mainMenu: types.buttonData[] = [
    { content: 'Leaderboard', type: 'button', img: null, ariaLabel: 'Leaderboard Menu Button' },
    { content: 'Play', type: 'button', img: null, ariaLabel: 'Pong Game Menu Button' },
    { content: 'Profile', type: 'button', img: null, ariaLabel: 'User Profile Menu Button' },
];

export const gameMenu: types.buttonData[] = [
    { content: 'Local game', type: 'button', img: null, ariaLabel: 'Play a local game' },
    { content: 'Remote game', type: 'button', img: null, ariaLabel: 'Play a remote game' },
];

export const userColorsMenu: types.buttonData[] = [
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

export const languageMenu: types.buttonData[] = [
    { ariaLabel: 'English', content: 'English', img: null, type: 'button' },
    { ariaLabel: 'Spanish', content: 'Spanish', img: null, type: 'button' },
    { ariaLabel: 'French', content: 'French', img: null, type: 'button' },
];

export const backgroundMenu: types.buttonData[] = [
    { ariaLabel: 'farm', content: 'Adorable Farm', img: null, type: 'button' },
    { ariaLabel: 'forest', content: 'Enchanted Forest', img: null, type: 'button' },
    { ariaLabel: 'underwater', content: 'Magical Underwater', img: null, type: 'button' },
    { ariaLabel: 'Snow', content: 'Mysterious Snow', img: null, type: 'button' },
];

export const iMeta: types.ImgData = {
    alt: 'pp',
    id: 'user-avatar',
    size: 'imedium',
    src: '/assets/icons/purple-avatar.png',
};

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

export const localPong: types.formDetails = {
    action: '/gameManager',
    heading: 'Local Pong',
    ariaLabel: 'Pong settings',
    id: 'local-pong-settings',
    method: 'post',
    fields: [
        {
            id: 'opponent',
            labelContent: 'Opponent Nickname',
            pattern: usernamePattern,
            placeholder: "Challenger's nickname",
            type: 'text',
            required: true,
        },
        {
            id: 'ballspeed',
            labelContent: 'Starting Ball Speed',
            max: '5',
            min: '0',
            pattern: '',
            placeholder: '',
            required: true,
            step: '1',
            type: 'range',
        },
        {
            id: 'paddlesize',
            labelContent: 'Paddle size',
            max: '5',
            min: '0',
            pattern: '',
            placeholder: '',
            required: true,
            step: '1',
            type: 'range',
        },
        {
            id: 'paddlespeed',
            labelContent: 'Paddle speed',
            max: '5',
            min: '0',
            pattern: '',
            placeholder: '',
            required: true,
            step: '1',
            type: 'range',
        },
    ],
    button: { type: 'submit', content: 'Start game', img: null, ariaLabel: '' },
};

export const remotePong: types.formDetails = {
    action: '/gameManager',
    heading: 'Remote Pong',
    ariaLabel: 'Remote Pong settings',
    id: 'remote-pong-settings',
    method: 'post',
    fields: [
        {
            id: 'ballspeed',
            labelContent: 'Starting Ball Speed',
            max: '5',
            min: '0',
            pattern: '',
            placeholder: '',
            required: true,
            step: '1',
            type: 'range',
        },
        {
            id: 'paddlesize',
            labelContent: 'Paddle size',
            max: '5',
            min: '0',
            pattern: '',
            placeholder: '',
            required: true,
            step: '1',
            type: 'range',
        },
        {
            id: 'paddlespeed',
            labelContent: 'Paddle speed',
            max: '5',
            min: '0',
            pattern: '',
            placeholder: '',
            required: true,
            step: '1',
            type: 'range',
        },
    ],
    button: { type: 'submit', content: 'Start game', img: null, ariaLabel: '' },
};

export const deleteAccount: types.formDetails = {
    action: '/account/delete',
    heading: '',
    ariaLabel: 'Account deletion request',
    id: 'account-deletion-request',
    method: 'post',
    fields: [],
    button: { type: 'submit', content: 'Delete account', img: null, ariaLabel: '', style: 'red' },
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

export const mout1: types.matchOutcome = {
    date: '24.10.2025',
    opponent: 'DumbCamel',
    outcome: 'Win',
    score: '5-3',
    duration: "2'53",
    tournament: true,
};

export const mout2: types.matchOutcome = {
    date: '24.10.2025',
    opponent: 'AnotherFuckingPlayer',
    outcome: 'loss',
    score: '5-3',
    duration: "0'53",
    tournament: false,
};

export const matchesHistory: types.matchOutcome[] = [
    mout1,
    mout2,
    mout2,
    mout1,
    mout1,
    mout1,
    mout2,
];

export const tabs: Array<types.TabData> = [
    { id: 'friends', content: 'Friends', default: true, panelContent: users },
    { id: 'history', content: 'Game history', default: false, panelContent: matchesHistory },
    { id: 'stats', content: 'Statistics', default: false, panelContent: [] },
];

export const m1: types.matchParticipants = {
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
        username: 'm1p1',
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
        username: 'm1p2',
        winstreak: '4',
        since: '35',
    },
};

export const m2: types.matchParticipants = {
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
        profileColor: 'bg-4F9FFF',
        language: 'English',
        status: true,
        username: 'm2p1',
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
        profileColor: 'bg-5200FF',
        language: 'English',
        status: true,
        username: 'm2p2',
        winstreak: '4',
        since: '35',
    },
};

export const m3: types.matchParticipants = {
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
        profileColor: 'bg-000080',
        language: 'English',
        status: true,
        username: 'm3p1',
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
        username: 'm3p2',
        winstreak: '4',
        since: '35',
    },
};

export const m4: types.matchParticipants = {
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
        profileColor: 'bg-BE5103',
        language: 'English',
        status: true,
        username: 'm4p1',
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
        profileColor: 'bg-CE4257',
        language: 'English',
        status: true,
        username: 'm4p2',
        winstreak: '4',
        since: '35',
    },
};

export const r2m1: types.matchParticipants = {
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
        profileColor: 'bg-4F9FFF',
        language: 'English',
        status: true,
        username: 'm2p1',
        winstreak: '7',
        since: '145',
    },
    player2: {
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
        username: 'm1p1',
        winstreak: '7',
        since: '145',
    },
};

export const r2m2: types.matchParticipants = {
    player1: {
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
        username: 'm3p2',
        winstreak: '4',
        since: '35',
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
        profileColor: 'bg-CE4257',
        language: 'English',
        status: true,
        username: 'm4p2',
        winstreak: '4',
        since: '35',
    },
};

export const tournament: types.matchParticipants[] = [m1, m2, m3, m4];
export const tournamentR2: types.matchParticipants[] = [r2m1, r2m2];
