import type { buttonData, UserData } from './types-interfaces';

export const socialMenu: Array<buttonData> = [
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

export const userDefault: UserData = {
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

export const usernamePattern: string = '^[a-zA-Z0-9]{4,18}$';
export const passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&]).{12,256}$';

export const users: Array<UserData> = [
    userDefault,
    userDefault,
    userDefault,
    userDefault,
    userDefault,
    userDefault,
];

export const mainMenu: Array<buttonData> = [
    { content: 'Profile', type: 'button', img: null, ariaLabel: 'User Profile Menu Button' },
    { content: 'Play', type: 'button', img: null, ariaLabel: 'Pong Game Menu Button' },
    { content: 'Leaderboard', type: 'button', img: null, ariaLabel: 'Leaderboard Menu Button' },
];

export const gameMenu: Array<buttonData> = [
    { content: 'Local game', type: 'button', img: null, ariaLabel: 'Play a local game' },
    { content: 'Remote game', type: 'button', img: null, ariaLabel: 'Play a remote game' },
];
