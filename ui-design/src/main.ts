import * as inputs from './web-elements/inputs/helpers.js';
import * as typography from './web-elements/typography/helpers.js';
import * as formBtns from './web-elements/inputs/helpers.js';
import * as nav from './web-elements/navigation/helpers.js';
import * as user from './web-elements/users/helpers.js';
import * as defaults from './default-values.js';
// import { Notification } from './web-elements/users/notifications.js';
import type * as types from './types-interfaces.js';

const iMeta: types.ImgMetadata = {
    id: 'user-avatar',
    src: '/assets/icons/purple-avatar.png',
    alt: 'pp',
    size: 'imedium',
};

const tabs: Array<types.TabMetadata> = [
    { id: 'history', content: 'Game history', default: true },
    { id: 'stats', content: 'Statistics', default: false },
    { id: 'friends', content: 'Friends', default: false },
];

const textData: types.InputMetadata = {
    type: 'text',
    pattern: defaults.usernamePattern,
    id: 'username',
    placeholder: 'Enter your username!',
    labelContent: 'Username',
};

const pwData: types.InputMetadata = {
    type: 'password',
    pattern: defaults.passwordPattern,
    id: 'password',
    placeholder: 'Enter your password!',
    labelContent: 'Password',
};

const slider: types.InputMetadata = {
    type: 'range',
    pattern: '',
    id: 'paddle-speed',
    placeholder: '',
    labelContent: 'Paddle speed',
    min: '0',
    max: '5',
    step: '1',
};

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

const innerW = window.innerWidth;
const wrapper = document.createElement('div');
wrapper.classList.add(
    'border-box',
    'justify-items-center',
    'grid',
    'gap-6',
    `w-[${innerW}]`,
    'pad-sm'
);

try {
    wrapper.appendChild(typography.createHeading('1', 'Heading 1'));
    wrapper.appendChild(typography.createHeading('2', 'Heading 2'));
    wrapper.appendChild(typography.createHeading('3', 'Heading 3'));
    wrapper.appendChild(inputs.createUploadInput('upload'));
    wrapper.appendChild(inputs.createInputGrp(textData));
    wrapper.appendChild(inputs.createInputGrp(pwData));
    wrapper.appendChild(inputs.createInputGrp(slider));
    wrapper.appendChild(formBtns.createRadioBtn('radio', 'test'));
    wrapper.appendChild(formBtns.createCheckbox('check', 'test'));
    wrapper.appendChild(nav.createTabs(tabs));
    wrapper.appendChild(typography.createAvatar(iMeta));
    wrapper.appendChild(nav.createMenu(defaults.mainMenu, 'horizontal'));
    wrapper.appendChild(nav.createMenu(defaults.mainMenu, 'vertical'));
    wrapper.appendChild(nav.createMenu(defaults.gameMenu, 'vertical', 'l', true));
    wrapper.appendChild(user.createUserCardSocial(defaults.socialMenu, defaults.userDefault));
    wrapper.appendChild(user.createUserInline(defaults.userDefault));
    wrapper.appendChild(nav.createSearchbar());
    // wrapper.appendChild(user.createNotificationBox());

    // nav.getSearchbarAsync().then((bar) => {
    //     try {
    //         if (bar) bar.displayResults(defaults.users);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // });

    // user.getcreateNotificationBoxAsync().then((n) => {
    //     try {
    //         if (n) {
    //             setTimeout(() => {
    //                 n.newFriendRequest('CrimeGoose');
    //             }, 2000);
    //             setTimeout(() => {
    //                 n.newGameInvitation('ShyElephant', 'tournament');
    //             }, 6000);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // });

    wrapper.appendChild(user.createUserCardSocial(defaults.socialMenu, defaults.userDefault));
} catch (error) {
    console.log('[ERROR]', error);
}

document.body.append(wrapper);

if (import.meta.hot) {
    import.meta.hot.accept();
}
