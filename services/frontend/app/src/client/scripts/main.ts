import { Router } from './spaRouter/router.class.js';
import { routes } from './spaRouter/routes.js';
import { pong } from './game/pong.js';
import { addLanguageEvents } from './language/languageEvents.js';
import { initLanguageCSR } from './language/translation.js';

export const router = new Router(routes);

function sanitisePath(path: string) {
    if (path == "/")
        return path;
    return path.replace(/\/+$/, '');
}

document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest('[data-link]');
    if (link) {
        event.preventDefault();
        const path = link.getAttribute('href');
		if (path !== null) {
	        window.history.pushState({}, '', path);
	        const cleanPath = sanitisePath(path);
			router._loadRoute(cleanPath);
		}
    }
});

window.addEventListener('popstate', () => {
    const cleanPath = sanitisePath(window.location.pathname);
    router._loadRoute(cleanPath);
});

if (router._getCurrentURL() === '/game/match')
    pong(); //TODO: find a way to render it server side

initLanguageCSR();
addLanguageEvents();

document.getElementById('send-friend-btn')?.addEventListener('click', async () => {
    console.log("\n1\n")
    const res = await fetch(`/api/user/friends-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requester_id: "alex", requestee_id: "Hugues" }),
        credentials: 'include' // optional, if using cookies/sessions
    });
    if (res.ok) {
        console.log("\nFriend request sent!\n")
        // Optionally, show success to user
        alert('Friend request sent!');
    } else {
        console.log("\nFailed to send request!\n")
        // Optionally, handle error
        alert('Failed to send request');
    }
});

async function sendFriendRequestApi() {
  try {
    console.log('in function');

    const targetUsername = "alex";
    const senderUserId = 123; // Vient probablement d'un état de connexion
    const friendRequestData = {
      userId: senderUserId,
      statusFriendship: 'pending'
    }

    const bodyAsString = JSON.stringify(friendRequestData);

    const response = await fetch(`/api/user/friends-requests/${targetUsername}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyAsString,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Request success:', data);
    alert('Friend request sent successfully!');
  } catch (error) {
    console.error('Request failed', error);
    alert('Failed to send friend request.');
  }
}

document.getElementById('send-request-btn')?.addEventListener('click', (event) => {
  event.preventDefault();
  console.log("that fuc");
  sendFriendRequestApi();
});