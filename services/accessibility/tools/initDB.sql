CREATE TABLE
	IF NOT EXISTS language_packs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		language_code TEXT UNIQUE NOT NULL,
		pack_json TEXT NOT NULL
	);

DELETE FROM language_packs;

INSERT INTO
	language_packs (language_code, pack_json)
VALUES
	(
		'English',
		'{
	"privacy": {
		"mainTitle": "GDPR Compliance & Data Privacy",
		"storageTitle": "What We Store",
		"rightsTitles": "Your Rights",
		"intro": "We value your privacy. In compliance with the General Data Protection Regulation (GDPR), this page outlines exactly what data we store, why we store it, and your rights regarding that data.",
		"identity": "<strong>Identity:</strong> Username, avatar image, and biography to display your profile to other players.",
		"auth": "<strong>Authentication:</strong> Securely hashed passwords. We never store your actual password.", 
		"history": "<strong>Game History:</strong> Statistics (Wins, Losses, Streaks) and a log of matches played to populate leaderboards and history.",
		"social": "<strong>Social:</strong> Your list of friends and pending friend requests.",
		"sessionData": "<strong>Session Data:</strong> We use a secure HTTP-only cookie (JWT) to keep you logged in. We do not use third-party tracking cookies. In that cookie, we store your userID (that we generate) and your username (that we set) so we can render your informations on the website. That cookie expires on its own after an hour.",
		"access": "<strong>Right to Access (Portability):</strong> You can download a full copy of your personal data in JSON format via the User Settings page.",
		"erasure": "<strong>Right to Erasure (Right to be Forgotten):</strong> You can delete your account at any time. This process is permanent and irreversibly anonymizes your data (replacing your username or avatar with generic placeholders) while preserving game statistics for fair history.",
		"rectify": "<strong>Right to Rectification:</strong> You can update your profile information (username, bio, avatar, language) at any time."
	},
    "buttons": {
        "submit": "Submit",
        "cancel": "Cancel",
        "search": "Search",
        "delete": "Delete",
        "decline": "Decline",
        "accept": "Accept",
        "play": "Play",
        "leaderboard": "Leaderboard",
        "profile": "Profile",
        "login": "Log in",
        "logout": "Log out",
        "start_game": "Start game",
        "start_tournament": "Start tournament",
        "delete_account": "Delete account",
        "download_data": "Download personal data",
        "privacy": "Privacy policy",
        "go_home": "Go home",
        "downloaded": "Data downloaded"
    },
    "forms": {
        "username": "Username",
        "password": "Password",
        "biography": "Biography",
        "avatar": "Avatar",
        "search_placeholder": "Search...",
        "avatar_uploader": "Avatar uploader"
    },
    "titles": {
        "settings": "Settings",
        "register": "Register",
        "login": "Login",
        "local_pong": "Local Pong",
        "remote_pong": "Remote Pong",
        "tournament": "Tournament",
        "leaderboard": "Leaderboard",
        "home": "Home",
        "pong_tournament": "Pong Tournament",
        "choose_lobby": "Choose Lobby"
    },
    "profile": {
        "joined": "Joined",
        "friends": "Friends",
        "game_history": "Game History",
        "statistics": "Statistics",
        "date": "Date",
        "opponent": "Opponent",
        "outcome": "Outcome",
        "score": "Score",
        "duration": "Duration",
        "tournament": "Tournament"
    },
    "notifs": {
        "notif_placeholder": "No new notifications",
        "notif_friends": " sent you a friend request!",
        "notif_match" : "challenged you to a match"

    },
    "gameCustom": {
        "ball_speed": "Starting Ball Speed",
        "paddle_size": "Paddle Size",
        "paddle_speed": "Paddle Speed",
        "paddle_horizontal": "Horizontal Movement",
        "opponent": "Opponent",
        "start": "Start Game",
        "local": "Local",
        "remote": "Remote",
        "background": "Background",
        "farm": "Adorable Farm",
        "forest": "Enchanted Forest",
        "under_water": "Magical Underwater",
        "searchbar": "Searchbar",
        "choose_back": "Choose background"

    },
    "error": {
        "username_error": "Invalid username or password.",
        "password_error": "Password must be at least 8 characters.",
        "uppercase": "missing an uppercase letter",
        "lowercase": "missing an lowercase letter",
        "number": "missing an number",
        "special_char": "missing a special character",
        "pass_lenght": "Password should be 12-64 characters long, is",
        "forbidden": "Forbidden character",
        "username_lenght": "Username should be ",
        "username_lenght2": " -18 character long, is ",
        "file_heavy": "That file is too heavy: max is 2MB!",
        "file_extension": "Invalid extension: ",
        "page404": "There''s nothing here :(",
        "join_lobby": "Uh-oh! You can''t be there - go join a lobby or something !",
        "invite_lobby": "You were not invited to this lobby!",
        "deleted_lobby": "The lobby you are trying to join does not exist anymore!",
        "broke_lobby": "Your lobby is malfunctionning! Please create a new one!",
        "nbplayers_lobby": "You do not have enough players in your lobby to start playing!",
        "account_deleted": "Account permanently deleted",
        "bad_request": "Bad Request",
        "unauthorized": "Unauthorized",
        "conflict": "Conflict: Resource already exists",
        "redirection": "Redirected: You must be registered to see this page!",
        "something_wrong": "Something went wrong",
        "no_user": "No such user",
        "login_lobby": "You are not logged in and thus cannot join a lobby!",
        "too_many_players": "You can''t invite any more people!",
        "invite_yourself": "You can''t invite yourself, dummy"
    },
    "lobby": {
        "local": "Local 1v1",
        "remote": "Remote 1v1",
        "tournament": "Tournament"
    },
    "placeholders": {
        "enter_password": "Enter your password!",
        "enter_username": "Enter your username!",
        "enter_biography": "Enter your biography",
        "upload_file": "Choose a file from your computer..."
    },
    "settings": {
        "pick_color": "Pick color",
        "pick_language": "Pick language"
    },
    "match_history": {
        "date": "date",
        "opponent": "opponent",
        "outcome": "outcome",
        "score": "score",
        "duration": "duration",
        "tournament": "game mode"
    }
}'
	);

INSERT INTO
	language_packs (language_code, pack_json)
VALUES
	(
		'Francais',
		'{
    "privacy": {
        "mainTitle": "Conformité RGPD & Confidentialité des Données",
        "storageTitle": "Ce que Nous Stockons",
        "rightsTitles": "Vos Droits",
        "intro": "Nous accordons une grande importance à votre vie privée. En conformité avec le Règlement Général sur la Protection des Données (RGPD), cette page décrit précisément quelles données nous stockons, pourquoi nous les stockons, et quels sont vos droits concernant ces données.",
        "identity": "<strong>Identité :</strong> Nom d''utilisateur, image d''avatar et biographie pour afficher votre profil aux autres joueurs.",
        "auth": "<strong>Authentification :</strong> Mots de passe sécurisés et hachés. Nous ne stockons jamais votre mot de passe réel.",
        "history": "<strong>Historique de Jeu :</strong> Statistiques (Victoires, Défaites, Séries) et journal des matchs joués pour alimenter les classements et l''historique.",
        "social": "<strong>Social :</strong> Votre liste d''amis et vos demandes d''amis en attente.",
        "sessionData": "<strong>Données de Session :</strong> Nous utilisons un cookie HTTP-only sécurisé (JWT) pour maintenir votre connexion. Nous n''utilisons pas de cookies de suivi tiers. Dans ce cookie, nous stockons votre identifiant utilisateur (que nous générons) et votre nom d''utilisateur (que vous définissez) afin d''afficher vos informations sur le site. Ce cookie expire automatiquement après une heure.",
        "access": "<strong>Droit d''Accès (Portabilité) :</strong> Vous pouvez télécharger une copie complète de vos données personnelles au format JSON via la page des Paramètres Utilisateur.",
        "erasure": "<strong>Droit à l''Effacement (Droit à l''Oubli) :</strong> Vous pouvez supprimer votre compte à tout moment. Ce processus est permanent et rend vos données anonymes de manière irréversible (remplaçant votre nom d''utilisateur et avatar par des éléments génériques) tout en conservant les statistiques de jeu pour un historique équitable.",
        "rectify": "<strong>Droit de Rectification :</strong> Vous pouvez mettre à jour les informations de votre profil (nom d''utilisateur, bio, avatar, langue) à tout moment."
    },
    "buttons": {
        "submit": "Valider",
        "cancel": "Annuler",
        "search": "Rechercher",
        "delete": "Supprimer",
        "decline": "Refuser",
        "accept": "Accepter",
        "play": "Jouer",
        "leaderboard": "Classement",
        "profile": "Profil",
        "login": "Connexion",
        "logout": "Déconnexion",
        "start_game": "Lancer la partie",
        "start_tournament": "Lancer le tournoi",
        "delete_account": "Supprimer le compte",
        "download_data": "Télécharger vos données",
        "privacy": "Politique de confidentialité",
        "go_home": "Retourner a l''accueil",
        "downloaded": "Donnees telechargees"
    },
    "forms": {
        "username": "Nom d''utilisateur",
        "password": "Mot de passe",
        "biography": "Biographie",
        "avatar": "Avatar",
        "search_placeholder": "Rechercher...",
        "avatar_uploader": "Téléchargement d''avatar"
    },
    "titles": {
        "settings": "Paramètres",
        "register": "Inscription",
        "login": "Connexion",
        "local_pong": "Pong Local",
        "remote_pong": "Pong Distant",
        "tournament": "Tournoi",
        "leaderboard": "Classement",
        "home": "Accueil",
        "pong_tournament": "Tournoi de Pong"
    },
    "profile": {
        "joined": "Rejoint le",
        "friends": "Amis",
        "game_history": "Historique",
        "statistics": "Statistiques",
        "date": "Date",
        "opponent": "Adversaire",
        "outcome": "Résultat",
        "score": "Score",
        "duration": "Durée",
        "tournament": "Tournoi"
    },
    "notifs": {
        "notif_placeholder": "Pas de nouvelles notifications",
        "notif_friends": " t''as envoye une demande d''ami!",
        "notif_match" : " t''as challenge a un "
    },
    "gameCustom": {
        "ball_speed": "Vitesse de la balle",
        "paddle_size": "Taille raquette",
        "paddle_speed": "Vitesse raquette",
        "paddle_horizontal": "Mouvement horizontal",
        "opponent": "Adversaire",
        "start": "Démarrer",
        "local": "Local",
        "remote": "Distant",
        "background": "Arrière-plan",
        "farm": "Ferme adorable",
        "forest": "Forêt enchantee",
        "under_water": "Sous l''eau",
        "searchbar": "Barre de recherche",
        "choose_back": "Choisi ton fond"
    },
    "error": {
        "username_error": "Nom d''utilisateur ou mot de passe invalide.",
        "password_error": "Le mot de passe doit contenir au moins 8 caractères.",
        "uppercase": "Il manque une majuscule",
        "lowercase": "Il manque une minuscule",
        "number": "Il manque un chiffre",
        "special_char": "Il manque un caractère spécial",
        "pass_lenght": "Le mot de passe doit contenir 12 à 64 caractères, il en fait ",
        "forbidden": "Caractère interdit",
        "username_lenght": "Le nom d''utilisateur doit faire ",
        "username_lenght2": " -18 caractères, il en fait ",
        "file_heavy": "Fichier trop volumineux : max 2 Mo !",
        "file_extension": "Extension invalide : ",
        "page404": "Il n''y a rien ici :(",
        "join_lobby": "Oh-oh! Tu n''as pas le droit d''etre ici - Vas rejoindre un lobby !",
        "invite_lobby": "Vous n''avez pas ete invite dans ce lobby !",
        "deleted_lobby": "Le lobby que vous essayez de rejoindre n''existe plus !",
        "broke_lobby": "Votre lobby fonctionne mal ! Veuillez en creer un nouveau !",
        "nbplayers_lobby": "Vous n''avez pas assez de joueurs dans votre lobby pour commencer a jouer !",
        "account_deleted": "Compte supprime definitivement",
        "bad_request": "Mauvaise requete",
        "unauthorized": "Non autorise",
        "conflict": "Conflit : La ressource existe deja",
        "redirection": "Redirection: Tu dois etre connecter pour voir cette page!",
        "something_wrong": "Quelque chose s''est mal passé",
        "no_user": "Cette utilisateur n''existe pas",
        "login_lobby": "Tu n''est pas connecter donc tu ne peux pas rejoindre de lobby!",
        "too_many_players": "Tu ne peux pas inviter plus de joueurs!",
        "invite_yourself": "Tu ne peux pas t''inviter toi-meme!"
    },
    "lobby": {
        "local": "Local 1vs1",
        "remote": "Distant 1vs1",
        "tournament": "Tournoi"
    },
    "placeholders": {
        "enter_password": "Entrez votre mot de passe !",
        "enter_username": "Entrez votre nom d''utilisateur !",
        "enter_biography": "Entrez votre biographie",
        "upload_file": "Choisir un fichier..."
    },
    "settings": {
        "pick_color": "Choisir une couleur",
        "pick_language": "Choisir la langue"
    },
    "match_history": {
        "date": "date",
        "opponent": "opposant",
        "outcome": "resultat",
        "score": "score",
        "duration": "duree",
        "tournament": "mode de jeu"
    }
}'
	);

INSERT INTO
	language_packs (language_code, pack_json)
VALUES
	(
		'Espanol',
		'{
	"privacy": {
        "mainTitle": "Cumplimiento GDPR y Privacidad de Datos",
        "storageTitle": "Qué Almacenamos",
        "rightsTitles": "Tus Derechos",
        "intro": "Valoramos tu privacidad. En cumplimiento con el Reglamento General de Protección de Datos (GDPR), esta página detalla exactamente qué datos almacenamos, por qué los almacenamos y cuáles son tus derechos respecto a esos datos.",
        "identity": "<strong>Identidad:</strong> Nombre de usuario, imagen de avatar y biografía para mostrar tu perfil a otros jugadores.",
        "auth": "<strong>Autenticación:</strong> Contraseñas cifradas de forma segura. Nunca almacenamos tu contraseña real.",
        "history": "<strong>Historial de Juego:</strong> Estadísticas (Victorias, Derrotas, Rachas) y un registro de partidas jugadas para completar los marcadores y el historial.",
        "social": "<strong>Social:</strong> Tu lista de amigos y solicitudes de amistad pendientes.",
        "sessionData": "<strong>Datos de Sesión:</strong> Usamos una cookie HTTP-only segura (JWT) para mantener tu sesión activa. No utilizamos cookies de seguimiento de terceros. En esa cookie almacenamos tu ID de usuario (que generamos) y tu nombre de usuario (que establecemos) para poder mostrar tu información en el sitio web. Esa cookie expira automáticamente después de una hora.",
        "access": "<strong>Derecho de Acceso (Portabilidad):</strong> Puedes descargar una copia completa de tus datos personales en formato JSON desde la página de Configuración de Usuario.",
        "erasure": "<strong>Derecho de Supresión (Derecho al Olvido):</strong> Puedes eliminar tu cuenta en cualquier momento. Este proceso es permanente y anonimiza tus datos de forma irreversible (reemplazando tu nombre de usuario ou avatar con valores genéricos) preservando las estadísticas de juego para mantener un historial justo.",
        "rectify": "<strong>Derecho de Rectificación:</strong> Puedes actualizar la información de tu perfil (nombre de usuario, biografía, avatar, idioma) en cualquier momento."
    },
    "buttons": {
        "submit": "Enviar",
        "cancel": "Cancelar",
        "search": "Buscar",
        "delete": "Eliminar",
        "accept": "Aceptar",
        "decline": "Rechazar",
        "play": "Jugar",
        "leaderboard": "Clasificación",
        "profile": "Perfil",
        "login": "Iniciar sesión",
        "logout": "Cerrar sesión",
        "start_game": "Empezar partida",
        "start_tournament": "Empezar torneo",
        "delete_account": "Eliminar cuenta",
        "download_data": "Descargar datos",
        "privacy": "Política de privacidad",
        "go_home": "Volver al inicio",
        "downloaded": "Datos descargados"
    },
    "forms": {
        "username": "Nombre de usuario",
        "password": "Contraseña",
        "biography": "Biografía",
        "avatar": "Avatar",
        "search_placeholder": "Buscar...",
        "avatar_uploader": "Subir avatar"
    },
    "titles": {
        "settings": "Configuración",
        "register": "Registrarse",
        "login": "Iniciar sesión",
        "local_pong": "Pong Local",
        "remote_pong": "Pong Remoto",
        "tournament": "Torneo",
        "leaderboard": "Clasificación",
        "home": "Inicio",
        "pong_tournament": "Torneo de Pong"
    },
    "profile": {
        "joined": "Unido el",
        "friends": "Amigos",
        "game_history": "Historial",
        "statistics": "Estadísticas",
        "date": "Fecha",
        "opponent": "Oponente",
        "outcome": "Resultado",
        "score": "Puntuación",
        "duration": "Duración",
        "tournament": "Torneo"
    },
    "notifs": {
        "notif_placeholder": "No hay notificaciones nuevas",
        "notif_friends": " te envie una solicitud de amistad!",
        "notif_match": " te retó a un "
    },
    "gameCustom": {
        "ball_speed": "Velocidad de bola",
        "paddle_size": "Tamaño de pala",
        "paddle_speed": "Velocidad de pala",
        "paddle_horizontal": "Movimiento horizontal",
        "opponent": "Oponente",
        "start": "Empezar",
        "local": "Local",
        "remote": "Remoto",
        "background": "Fondo",
        "farm": "Adorable granja",
        "forest": "Bosque encantado",
        "under_water": "Bajo el agua",
        "searchbar": "barra de búsqueda",
        "choose_back": "Elige fondo"

    },
    "error": {
        "username_error": "Nombre de usuario o contraseña inválidos.",
        "password_error": "La contraseña debe tener al menos 8 caracteres.",
        "uppercase": "Falta una letra mayúscula",
        "lowercase": "Falta una letra minúscula",
        "number": "Falta un número",
        "special_char": "Falta un carácter especial",
        "pass_lenght": "La contraseña debe tener entre 12 y 64 caracteres, tiene ",
        "forbidden": "Carácter prohibido",
        "username_lenght": "El usuario debe tener ",
        "username_lenght2": " -18 caracteres, tiene ",
        "file_heavy": "El archivo es demasiado grande: ¡máx. 2MB!",
        "file_extension": "Extensión no válida: ",
        "page404": "No hay nada aqui :(",
        "join_lobby": "No tienes derecho a estar aquí. ¡Únete a un lobby!",
        "invite_lobby": "¡No fuiste invitado a este lobby!",
        "deleted_lobby": "¡El lobby al que intentas unirte ya no existe!",
        "broke_lobby": "¡Tu lobby está funcionando mal! ¡Por favor crea uno nuevo!",
        "nbplayers_lobby": "¡No tienes suficientes jugadores en tu lobby para empezar a jugar!",
        "account_deleted": "Cuenta eliminada permanentemente",
        "bad_request": "Solicitud incorrecta",
        "unauthorized": "No autorizado",
        "conflict": "Conflicto: El recurso ya existe",
        "redirection": "Redirección: Debe iniciar sesión para ver esta página.",
        "something_wrong": "Algo salió mal",
        "no_user": "No hay tal usuaria/usuario",
        "login_lobby": "¡No has iniciado sesión y por lo tanto no puedes unirte a un lobby!",
        "too_many_players": "¡No puedes invitar a más personas!",
        "invite_yourself": "No puedes invitarte a ti mismo, tonto"
    },
    "lobby": {
        "local": "Local 1vs1",
        "remote": "Remoto 1vs1",
        "tournament": "Torneo"
    },
    "placeholders": {
        "enter_password": "¡Introduce tu contraseña!",
        "enter_username": "¡Introduce tu nombre de usuario!",
        "enter_biography": "Introduce tu biografía",
        "upload_file": "Elige un archivo..."
    },
    "settings": {
        "pick_color": "Elegir color",
        "pick_language": "Elegir idioma"
    },
    "match_history": {
        "date": "fecha",
        "opponent": "adversario",
        "outcome": "resultado",
        "score": "puntaje",
        "duration": "duración",
        "tournament": "modo de juego"
    }
}'
	);