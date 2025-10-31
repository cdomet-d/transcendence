import type { buttonData, TabData } from '../types-interfaces';

export const mainMenu: buttonData[] = [
    { content: 'Leaderboard', type: 'button', img: null, ariaLabel: 'Leaderboard Menu Button' },
    { content: 'Play', type: 'button', img: null, ariaLabel: 'Pong Game Menu Button' },
    { content: 'Profile', type: 'button', img: null, ariaLabel: 'User Profile Menu Button' },
];

export const gameMenu: buttonData[] = [
    { content: 'Local game', type: 'button', img: null, ariaLabel: 'Play a local game' },
    { content: 'Remote game', type: 'button', img: null, ariaLabel: 'Play a remote game' },
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

export const languageMenu: buttonData[] = [
    { ariaLabel: 'English', content: 'English', img: null, type: 'button' },
    { ariaLabel: 'Spanish', content: 'Spanish', img: null, type: 'button' },
    { ariaLabel: 'French', content: 'French', img: null, type: 'button' },
];

export const backgroundMenu: buttonData[] = [
    { ariaLabel: 'farm', content: 'Adorable Farm', img: null, type: 'button' },
    { ariaLabel: 'forest', content: 'Enchanted Forest', img: null, type: 'button' },
    { ariaLabel: 'underwater', content: 'Magical Underwater', img: null, type: 'button' },
    { ariaLabel: 'Snow', content: 'Mysterious Snow', img: null, type: 'button' },
];

export const tabs: TabData[] = [
    { id: 'friends', content: 'Friends', default: true, panelContent: [] },
    { id: 'history', content: 'Game history', default: false, panelContent: [] },
    { id: 'stats', content: 'Statistics', default: false, panelContent: [] },
];
