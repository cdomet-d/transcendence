// import * as inputs from './web-elements/inputs/helpers';
// import * as typography from './web-elements/typography/helpers.js';
// import * as formBtns from './web-elements/inputs/helpers.js';
// import * as menu from './web-elements/navigation/menu-helpers';
// import * as tab from './web-elements/navigation/tabs-helpers';
// import * as user from './web-elements/users//profile-helpers';
import * as defaults from './default-values.js';
// import * as forms from './web-elements/forms/helpers.js';
// import { createNotificationBox } from './web-elements/users/notifications-helpers';
import { TournamentBrackets } from './web-elements/matches/tournament';

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
    'pad-sm',
);

// function testSearchbar() {
//     menu.getSearchbarAsync().then((bar) => {
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
    // wrapper.append(user.createUserCardSocial(defaults.user));
    // wrapper.append(user.createUserInline(defaults.user));
    // wrapper.append(user.createUserProfile(defaults.user));
    // wrapper.appendChild(formBtns.createCheckbox('check', 'test'));
    // wrapper.appendChild(formBtns.createRadioButton('radio', 'test'));
    // wrapper.appendChild(inputs.createInputGroup(defaults.pwData));
    // wrapper.appendChild(inputs.createInputGroup(defaults.slider));
    // wrapper.appendChild(inputs.createInputGroup(defaults.textData));
    // wrapper.appendChild(inputs.createInputGroup(defaults.uploadData));
    // wrapper.appendChild(inputs.createTextAreaGroup(defaults.textArea));
    // wrapper.appendChild(menu.createDropdown(defaults.languageMenu, 'Pick language', 'static'));
    // wrapper.appendChild(menu.createDropdown(defaults.userColorsMenu, 'Pick color', 'dynamic'));
    // wrapper.appendChild(menu.createMenu(defaults.gameMenu, 'vertical', 'l', true));
    // wrapper.appendChild(menu.createMenu(defaults.mainMenu, 'horizontal'));
    // wrapper.appendChild(menu.createMenu(defaults.mainMenu, 'vertical'));
    // wrapper.appendChild(tab.createTabs(defaults.tabs));
    // wrapper.appendChild(typography.createAvatar(defaults.iMeta));
    // wrapper.appendChild(typography.createHeading('1', 'Heading 1'));
    // wrapper.appendChild(typography.createHeading('2', 'Heading 2'));
    // wrapper.appendChild(typography.createHeading('3', 'Heading 3'));
    // wrapper.appendChild(createNotificationBox());
    // wrapper.append(forms.createUserSettingsForm(defaults.user, defaults.userSettingsForm));
    // wrapper.append(forms.createRegistrationForm(defaults.registrationForm));
    // wrapper.append(forms.createSearchbar(defaults.search));

    const el = document.createElement('div', { is: 'tournament-bracket' }) as TournamentBrackets;
    el.players = defaults.tournament;
    wrapper.append(el);
    // setTimeout(() => {
    //     el.populateBrackets(defaults.tournamentR2);
    // }, 2000);
} catch (error) {
    console.log('[ERROR]', error);
}

document.body.append(wrapper);

if (import.meta.hot) {
    import.meta.hot.accept();
}
