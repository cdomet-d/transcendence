import * as inputs from './web-elements/inputs/helpers.js';
import * as typography from './web-elements/typography/helpers.js';
import * as formBtns from './web-elements/inputs/helpers.js';
import * as nav from './web-elements/navigation/helpers.js';
import * as user from './web-elements/users/helpers.js';
import * as defaults from './default-values.js';
import { UserSettingsForm } from './web-elements/users/settings.js';

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

// function testSearchbar() {
//     nav.getSearchbarAsync().then((bar) => {
//         try {
//             if (bar) bar.displayResults(defaults.users);
//         } catch (error) {
//             console.log(error);
//         }
//     });
// }

// function testNotifications() {
//     user.getNotificationBoxAsync().then((n) => {
//         try {
//             if (n) {
//                 setTimeout(() => {
//                     n.newFriendRequest('CrimeGoose');
//                 }, 2000);
//                 setTimeout(() => {
//                     n.newGameInvitation('ShyElephant', 'tournament');
//                 }, 6000);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     });
// }

try {
    wrapper.appendChild(typography.createHeading('1', 'Heading 1'));
    wrapper.appendChild(typography.createHeading('2', 'Heading 2'));
    wrapper.appendChild(typography.createHeading('3', 'Heading 3'));
    wrapper.appendChild(inputs.createInputGroup(defaults.uploadData));
    wrapper.appendChild(inputs.createInputGroup(defaults.textData));
    wrapper.appendChild(inputs.createInputGroup(defaults.pwData));
    wrapper.appendChild(inputs.createInputGroup(defaults.slider));
    wrapper.appendChild(inputs.createTextAreaGroup(defaults.textArea));
    wrapper.appendChild(formBtns.createRadioButton('radio', 'test'));
    wrapper.appendChild(formBtns.createCheckbox('check', 'test'));
    wrapper.appendChild(nav.createTabs(defaults.tabs));
    wrapper.appendChild(typography.createAvatar(defaults.iMeta));
    wrapper.appendChild(nav.createMenu(defaults.mainMenu, 'horizontal'));
    wrapper.appendChild(nav.createMenu(defaults.mainMenu, 'vertical'));
    wrapper.appendChild(nav.createMenu(defaults.gameMenu, 'vertical', 'l', true));
    wrapper.appendChild(nav.createSearchbar());
    wrapper.appendChild(user.createNotificationBox());
    wrapper.appendChild(nav.createDropdown(defaults.languageMenu, 'Pick language', 'static'));
    wrapper.appendChild(nav.createDropdown(defaults.userColorsMenu, 'Pick color', 'dynamic'));
    wrapper.append(document.createElement('form', { is: 'settings-form' }) as UserSettingsForm);
    wrapper.append(user.createUserProfile(defaults.userDefault));
    wrapper.append(user.createUserCardSocial(defaults.userDefault));
    wrapper.append(user.createUserInline(defaults.userDefault));
} catch (error) {
    console.log('[ERROR]', error);
}

document.body.append(wrapper);

if (import.meta.hot) {
    import.meta.hot.accept();
}
