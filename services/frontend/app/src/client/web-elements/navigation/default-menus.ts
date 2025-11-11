import type { buttonData, MenuData, TabData } from '../types-interfaces.js';

export const main: MenuData = {
    links: [
        { title: 'Leaderboard', datalink: 'leaderboard', href: '/leaderboard', img: null },
        { title: 'Play', datalink: '/lobby', href: '/lobby', img: null },
        { title: 'Profile', datalink: 'profile', href: '/user/default', img: null },
    ],
};

export const homeLink: MenuData = {
    links: [
        {
            datalink: 'home',
            href: '/',
            title: 'Home',
            img: {
                alt: 'A cute pixel art blob',
                size: 'imedium',
                src: '/public/assets/images/default-avatar.png',
                id: 'home-link',
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
            img: {
                alt: 'a small pixel art blue blob with a green plus sign',
                id: 'friendship',
                size: 'ismall',
                src: '/public/assets/images/add-user.png',
            },
        },
        {
            ariaLabel: 'Remove user from friends',
            content: null,
            type: 'button',
            img: {
                alt: 'a small pixel art blue blob with a red minus sign',
                id: 'friendship',
                size: 'ismall',
                src: '/public/assets/images/remove-user.png',
            },
        },
    ],

    links: [
        {
            //TODO: autofill pongsettings form and lauch a 2 persons match
            datalink: '/lobby',
            href: '/lobby',
            title: '',
            img: {
                alt: 'two overlapping pixel art ping pong paddles',
                id: 'challenge',
                size: 'ismall',
                src: '/public/assets/images/challenge.png',
            },
        },
        { datalink: '/user/settings', href: '/user/settings', title: 'Settings', img: null },
    ],
};

export const languageMenu: buttonData[] = [
    { ariaLabel: 'English', content: 'English', img: null, type: 'button' },
    { ariaLabel: 'Spanish', content: 'Spanish', img: null, type: 'button' },
    { ariaLabel: 'French', content: 'French', img: null, type: 'button' },
];

export const backgroundMenu: buttonData[] = [
    { ariaLabel: 'farm', content: 'Adorable Farm', img: null, type: 'button' },
    { ariaLabel: 'forest', content: 'Enchanted Forest', img: null, type: 'button' },
    { ariaLabel: 'underwater', content: 'Magical Underwater', img: null, type: 'button' },
];

export const userColorsMenu: buttonData[] = [
    {
        ariaLabel: 'Hexcode selection for azure background.',
        content: '4F9FFF',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: 'Hexcode selection for purple background.',
        content: '5200FF',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: 'Hexcode selection for navy background.',
        content: '000080',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: 'Hexcode selection for green background.',
        content: '98A869',
        img: null,
        type: 'button',
    },
    {
        ariaLabel: 'Hexcode selection for orange background.',
        content: 'BE5103',
        img: null,
        type: 'button',
    },
    {
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
