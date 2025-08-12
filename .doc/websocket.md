# websockets

## Etapes pour obtenir une communication en websocket
**Phase d'initialisation (handshake)**: La connexion WebSocket commence par une **requête HTTP spéciale** (généralement une requête GET avec des en-têtes spécifiques comme Upgrade: websocket) pour demander au serveur de passer du protocole HTTP au protocole WebSocket. Cette étape est appelée le *handshake*.

**Apres le handshake**: Une fois la connexion WebSocket établie,**le protocole HTTP n'est plus utilisé**. Les échanges de données se font alors via le protocole WebSocket, qui permet une **communication bidirectionnelle et persistante** entre client et serveur, sans utiliser les méthodes HTTP classiques.

## Websocket URI
le protocole **WebSocket nécessite une URI** pour établir la connexion. Cette URI suit un schéma spécifique qui ressemble à une URL classique, mais avec un protocole dédié :
- Le schéma est soit **ws://** pour une connexion non sécurisée, soit **wss://** pour une connexion sécurisée via TLS (comme https).
- L’URI inclut l’hôte, le port optionnel, un chemin, et éventuellement une chaîne de requête, par exemple : `ws://example.com:8080/chat?token=abc123`

=> cette URI est crée dans le front avec “new webSocket”

## L'echange de données
l’echange de données se fait ensuite via les frames/trames. une trame est composé d’un en-tête et des “réelles” données a envoyer aka la charge utile (payload data). 

la charge utile peut etre du texte, un code de controle ou du binaire. un message peut etre envoyé en plusieurs frame. pour savoir si le message est fini ou si c’est une suite il faut regarder l’en-tete.

Dans l’en-tete on trouve :
- le bit FIN : s’il est à 1 c’est donc la derniere frame d’un message, s’il est à 0 c’est l’inverse.
- la champ opcode : `0x0` indique la consigne "continuer" (c’est la suite d’un message), `0x1` indique du texte (qui est systématiquement encodé en UTF-8) (nouveau message), `0x2` pour des données binaires, et d'autres "codes de contrôle"
- code de controle : connection close (0x8), ping (0x9), pong (0xA)
- le bit MASK : indique si le message a été encodé ou non
- les bit RSV1-3 : extensions (négociées lors du handshake)

c’est a nous de decider la façon de structurer les requetes dans le payload (le sous-protocol). soit on fait notre propre protocol sois on utilise un sous protocol qui doit etre negocié lors du handshake dans l’en-tête `Sec-WebSocket-Protocol`

ex de sous-protocol :
- SOAP
- WAMP
- MQTT
- XMPP