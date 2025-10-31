import * as inputs from './web-elements/inputs/helpers';
import * as typography from './web-elements/typography/helpers.js';
import * as formBtns from './web-elements/inputs/helpers.js';
import * as menu from './web-elements/navigation/menu-helpers';
import * as tab from './web-elements/navigation/tabs-helpers';
import * as user from './web-elements/users//profile-helpers';
import * as defaults from './default-values.js';
import * as forms from './web-elements/forms/helpers.js';

import {
    languageMenu,
    userColorsMenu,
    gameMenu,
    mainMenu,
    tabs,
} from './web-elements/navigation/default-menus';
import {
    userSettingsForm,
    registrationForm,
    localPong,
    remotePong,
} from './web-elements/forms/default-forms';
import { createNotificationBox } from './web-elements/users/notifications-helpers';
import { TournamentBrackets } from './web-elements/matches/tournament';
import { PageHeader } from './web-elements/navigation/header';

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

const innerW = window.innerWidth;
const wrapper = document.createElement('div');
wrapper.classList.add('box-border', 'justify-items-center', 'grid', 'gap-6', 'pad-sm');
wrapper.style.width = `${innerW}`;

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
    wrapper.append(user.createUserCardSocial(defaults.user));
    wrapper.append(user.createUserInline(defaults.user));
    wrapper.append(user.createUserProfile(defaults.user));
    wrapper.appendChild(formBtns.createCheckbox('checinline-matchk', 'test'));
    wrapper.appendChild(formBtns.createRadioButton('radio', 'test'));
    wrapper.appendChild(inputs.createInputGroup(defaults.pwData));
    wrapper.appendChild(inputs.createInputGroup(defaults.slider));
    wrapper.appendChild(inputs.createInputGroup(defaults.textData));
    wrapper.appendChild(inputs.createInputGroup(defaults.uploadData));
    wrapper.appendChild(inputs.createTextAreaGroup(defaults.textArea));
    wrapper.appendChild(menu.createDropdown(languageMenu, 'Pick language', 'static'));
    wrapper.appendChild(menu.createDropdown(userColorsMenu, 'Pick color', 'dynamic'));
    wrapper.appendChild(menu.createMenu(gameMenu, 'vertical', 'l', true));
    wrapper.appendChild(menu.createMenu(mainMenu, 'horizontal'));
    wrapper.appendChild(menu.createMenu(mainMenu, 'vertical'));
    wrapper.appendChild(tab.createTabs(tabs));
    wrapper.appendChild(typography.createAvatar(defaults.iMeta));
    wrapper.appendChild(typography.createHeading('1', 'Heading 1'));
    wrapper.appendChild(typography.createHeading('2', 'Heading 2'));
    wrapper.appendChild(typography.createHeading('3', 'Heading 3'));
    wrapper.appendChild(createNotificationBox());
    wrapper.append(forms.createForm('settings-form', userSettingsForm, defaults.user));
    wrapper.append(forms.createForm('default-form', registrationForm));
    wrapper.append(forms.createForm('search-form'));
    wrapper.append(forms.createForm('local-pong-settings', localPong));
    wrapper.append(forms.createForm('remote-pong-settings', remotePong));

    const tbracket = document.createElement('div', {
        is: 'tournament-bracket',
    }) as TournamentBrackets;
    tbracket.players = defaults.tournament;
    wrapper.append(tbracket);
    setTimeout(() => {
        tbracket.populateBrackets(defaults.tournamentR2);
    }, 2000);

    const header = document.createElement('header', { is: 'page-header' }) as PageHeader;
    wrapper.append(header);
} catch (error) {
    console.log('[ERROR]', error);
}

document.body.append(wrapper);

if (import.meta.hot) {
    import.meta.hot.accept();
}
