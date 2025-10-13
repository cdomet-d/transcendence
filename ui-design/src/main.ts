import * as inputs from './web-elements/inputs/helpers.js';
import * as typography from './web-elements/typography/helpers.js';
import * as formBtns from './web-elements/inputs/helpers.js';
import * as nav from './web-elements/navigation/helpers.js';
import * as user from './web-elements/users/helpers.js';
import * as defaults from './default-values.js';
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

const mainMenu: Array<types.buttonData> = [
    { content: 'Profile', type: 'button', img: null, ariaLabel: 'User Profile Menu Button' },
    { content: 'Play', type: 'button', img: null, ariaLabel: 'Pong Game Menu Button' },
    { content: 'Leaderboard', type: 'button', img: null, ariaLabel: 'Leaderboard Menu Button' },
];

const fieldData: types.InputMetadata = {
    type: 'text',
    pattern: '^[a-zA-Z0-9]{4,18}$',
    id: 'username',
    placeholder: 'Enter your username [Aa - Zz, 4 - 18 char]',
    labelContent: 'Username',
};

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

const innerW = window.innerWidth;
const wrapper = document.createElement('div');
wrapper.classList.add('border-box', 'grid', 'gap-6', `w-[${innerW}]`, 'pad-sm');

try {
    wrapper.appendChild(typography.createHeading('1', 'Heading 1'));
    wrapper.appendChild(typography.createHeading('2', 'Heading 2'));
    wrapper.appendChild(typography.createHeading('3', 'Heading 3'));
    wrapper.appendChild(inputs.createUploadInput('upload'));
    wrapper.appendChild(inputs.createInputGrp(fieldData));
    wrapper.appendChild(formBtns.createRadioBtn('radio', 'test'));
    wrapper.appendChild(formBtns.createCheckbox('check', 'test'));
    wrapper.appendChild(nav.createTabs(tabs));
    wrapper.appendChild(typography.createAvatar(iMeta));
    wrapper.appendChild(nav.createMenu(mainMenu, 'horizontal'));
    wrapper.appendChild(nav.createMenu(mainMenu, 'vertical'));
    wrapper.appendChild(user.createUserCardSocial(defaults.socialMenu, defaults.userDefault));
    wrapper.appendChild(user.createUserInline(defaults.userDefault));
    wrapper.appendChild(nav.createSearchbar());

    // nav.getSearchbarAsync().then((bar) => {
    //     try {
    //         if (bar) bar.displayResults(defaults.users);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // });

} catch (error) {
    console.log('[ERROR]', error);
}

document.body.append(wrapper);

if (import.meta.hot) {
    import.meta.hot.accept();
}
