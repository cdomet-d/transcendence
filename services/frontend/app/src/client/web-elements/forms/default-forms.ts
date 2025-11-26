import type { FormDetails } from '../types-interfaces.js';
import { usernamePattern, passwordPattern, searchbarPattern } from '../default-values.js';

//TODO: HTML froms don't support patch must come up with a way to identify which POST are actually post and which are patch, to be handled in the server.
export const userSettingsForm: FormDetails = {
    action: 'http://localhost:8443/api/bff/settings/',
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
    button: { id: 'submit', type: 'submit', content: 'submit', img: null, ariaLabel: '' },
};

export const registrationForm: FormDetails = {
    action: 'https://localhost:8443/api/auth/register',
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
    button: { id: 'submit', type: 'submit', content: 'submit', img: null, ariaLabel: '' },
};

export const loginForm: FormDetails = {
    action: 'https://localhost:8443/api/auth/login',
    heading: 'Login',
    ariaLabel: 'Log into an account',
    id: 'account-login',
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
    button: { id: 'submit', type: 'submit', content: 'submit', img: null, ariaLabel: '' },
};

export const search: FormDetails = {
    action: 'https://localhost:8443/api/bff/search?name=',
    heading: '',
    ariaLabel: 'Search for a user',
    id: 'searchform',
    method: 'get',
    fields: [
        {
            id: 'searchbar',
            labelContent: 'Searchbar',
            pattern: searchbarPattern,
            placeholder: 'Search...',
            type: 'text',
            required: true,
        },
    ],
    button: { id: 'submit', type: 'submit', content: 'Search', img: null, ariaLabel: '' },
};

export const localPong: FormDetails = {
    action: 'https://localhost:8443/api/game/lobby/',
    heading: 'Local Pong',
    ariaLabel: 'Pong settings',
    id: 'local-pong-settings',
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
        {
            id: 'opponent',
            labelContent: 'Opponent Nickname',
            pattern: usernamePattern,
            placeholder: "Challenger's nickname",
            type: 'text',
            required: true,
        },
    ],
    button: { id: 'submit', type: 'submit', content: 'Start game', img: null, ariaLabel: '' },
};

export const remotePong: FormDetails = {
    action: 'https://localhost:8443/api/game/lobby/',
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
    button: { id: 'submit', type: 'submit', content: 'Start game', img: null, ariaLabel: '' },
};

export const deleteAccount: FormDetails = {
    action: 'https://localhost:8443/api/bff/account',
    heading: '',
    ariaLabel: 'Account deletion request',
    id: 'account-deletion-request',
    method: 'delete',
    fields: [],
    button: {
        id: 'submit',
        type: 'submit',
        content: 'Delete account',
        img: null,
        ariaLabel: '',
        style: 'red',
    },
};
