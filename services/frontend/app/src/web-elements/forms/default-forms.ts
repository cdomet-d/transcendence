import type { FormDetails } from '../types-interfaces';
import { usernamePattern, passwordPattern } from '../default-values';

//TODO: HTML froms don't support patch must come up with a way to identify which POST are actually post and which are patch, to be handled in the server.
export const userSettingsForm: FormDetails = {
    action: '/account/settings/CrimeGoose',
    heading: 'Settings',
    ariaLabel: 'User settings',
    id: 'user-settings',
    method: 'post',
    fields: [
        {
            id: 'upload',
            labelContent: 'Avatar uploader',
            pattern: '',
            placeholder: '',
            type: 'file',
            required: false,
        },
        {
            id: 'biography',
            labelContent: 'Biography',
            pattern: '',
            placeholder: 'Enter your biography',
            type: 'textarea',
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

export const registrationForm: FormDetails = {
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

export const search: FormDetails = {
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

export const localPong: FormDetails = {
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

export const remotePong: FormDetails = {
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

export const deleteAccount: FormDetails = {
    action: '/account/delete',
    heading: '',
    ariaLabel: 'Account deletion request',
    id: 'account-deletion-request',
    method: 'post',
    fields: [],
    button: { type: 'submit', content: 'Delete account', img: null, ariaLabel: '', style: 'red' },
};
