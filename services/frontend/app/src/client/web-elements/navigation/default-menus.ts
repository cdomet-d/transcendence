import type { buttonData, MenuData, TabData } from '../types-interfaces.js';

export const main: MenuData = {
    links: [
        {
            id: 'leaderboard',
            title: 'Leaderboard',
            datalink: 'leaderboard',
            href: '/leaderboard',
            img: null,
        },
        { id: 'lobby', title: 'Play', datalink: '/lobbyMenu', href: '/lobbyMenu', img: null },
        { id: 'profile', title: 'Profile', datalink: 'profile', href: '/user/default', img: null },
    ],
};

export const homeLink: MenuData = {
    links: [
        {
            datalink: 'home',
            href: '/',
            title: 'Home',
            id: 'home',
            img: {
                alt: 'A cute pixel art blob',
                size: 'imedium',
                src: '/public/assets/images/default-avatar.png',
                id: 'homelink',
            },
        },
    ],
};

export const social: MenuData = {
    buttons: [
        {
            ariaLabel: 'Add user as friend',
            content: null,
            type: 'button',
            id: 'addFriend',
            img: {
                alt: 'a small pixel art blue blob with a green plus sign',
                id: '',
                size: 'ismall',
                src: '/public/assets/images/add-user.png',
            },
        },
        {
            ariaLabel: 'Remove user from friends',
            content: null,
            type: 'button',
            id: 'removeFriend',
            img: {
                alt: 'a small pixel art blue blob with a red minus sign',
                id: '',
                size: 'ismall',
                src: '/public/assets/images/remove-user.png',
            },
        },
    ],

    links: [
        {
            //TODO: autofill pongsettings form and lauch a 2 persons match
            datalink: '/lobby',
            id: 'challenge',
            href: '/lobby',
            title: '',
            img: {
                alt: 'two overlapping pixel art ping pong paddles',
                id: 'challengeIcon',
                size: 'ismall',
                src: '/public/assets/images/challenge.png',
            },
        },
        {
            datalink: '/user/settings',
            id: 'settings',
            href: '/user/settings',
            title: 'Settings',
            img: null,
        },
    ],
};

export const languageMenu: buttonData[] = [
    { id: 'English', ariaLabel: 'English', content: 'English', img: null, type: 'button' },
    { id: 'Spanish', ariaLabel: 'Spanish', content: 'Spanish', img: null, type: 'button' },
    { id: 'French', ariaLabel: 'French', content: 'French', img: null, type: 'button' },
];

export const backgroundMenu: buttonData[] = [
    { id: 'farm', ariaLabel: 'farm', content: 'Adorable Farm', img: null, type: 'button' },
    { id: 'forest', ariaLabel: 'forest', content: 'Enchanted Forest', img: null, type: 'button' },
    {
        id: 'underwater',
        ariaLabel: 'underwater',
        content: 'Magical Underwater',
        img: null,
        type: 'button',
    },
];

export const userColorsMenu: buttonData[] = [
    {
        id: '',
        ariaLabel: 'Hexcode selection for azure background.',
        content: '4F9FFF',
        img: null,
        type: 'button',
    },
    {
        id: '',
        ariaLabel: 'Hexcode selection for purple background.',
        content: '5200FF',
        img: null,
        type: 'button',
    },
    {
        id: '',
        ariaLabel: 'Hexcode selection for navy background.',
        content: '000080',
        img: null,
        type: 'button',
    },
    {
        id: '',
        ariaLabel: 'Hexcode selection for green background.',
        content: '98A869',
        img: null,
        type: 'button',
    },
    {
        id: '',
        ariaLabel: 'Hexcode selection for orange background.',
        content: 'BE5103',
        img: null,
        type: 'button',
    },
    {
        id: '',
        ariaLabel: 'Hexcode selection for red background.',
        content: 'CE4257',
        img: null,
        type: 'button',
    },
];

export const profileTabs: TabData[] = [
    { id: 'friends', content: 'Friends', default: true, panelContent: null },
    { id: 'history', content: 'Game history', default: false, panelContent: null },
    { id: 'stats', content: 'Statistics', default: false, panelContent: null },
];

export const lobbyMenu: MenuData = {
    links: [
        { id: 'quickmatch', title: '1vs1', datalink: '/quickLobby', href: '/quickLobby', img: null },
        { id: 'tournament', title: 'Tournament', datalink: '/tournamentLobby', href: '/tournamentLobby', img: null },
    ],
};
