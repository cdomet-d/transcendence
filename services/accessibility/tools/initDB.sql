-- Drop the table if it exists to ensure a clean slate (optional but recommended during dev)
-- DROP TABLE IF EXISTS language_packs;

-- Ensure table exists (matches your request)
CREATE TABLE IF NOT EXISTS language_packs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language_code TEXT UNIQUE NOT NULL,
    pack_json TEXT NOT NULL
);

-- Clear existing data to prevent unique constraint errors on re-seed
DELETE FROM language_packs;

-- 1. English (en)
INSERT INTO language_packs (language_code, pack_json) VALUES (
    'en',
    '{
    "buttons": {
        "submit": "Submit",
        "cancel": "Cancel",
        "search": "Search",
        "delete": "Delete",
        "decline": "Decline",
        "play": "Play",
        "leaderboard": "Leaderboard",
        "profile": "Profile",
        "login": "Log in",
        "logout": "Log out"
    },
    "forms": {
        "username": "Username",
        "password": "Password",
        "biography": "Biography",
        "avatar": "Avatar",
        "search_placeholder": "Search..."
    },
    "titles": {
        "settings": "Settings",
        "register": "Register",
        "login": "Login",
        "local_pong": "Local Pong",
        "remote_pong": "Remote Pong",
        "tournament": "Tournament",
        "leaderboard": "Leaderboard",
        "home": "Home"
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
        "notif_placeholder": "No new notifications"
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
        "farm": "Farm",
        "forest": "Forest",
        "under_water": "Under Water"
    },
    "error": {
        "username_error": "Invalid username or password.",
        "password_error": "Password must be at least 8 characters."
    },
    "lobby": {
        "local": "Local 1vs1",
        "remote": "Remote 1vs1",
        "tournament": "Tournament"
    }
}'
);

-- 2. French (fr)
INSERT INTO language_packs (language_code, pack_json) VALUES (
    'fr',
    '{
    "buttons": {
        "submit": "Valider",
        "cancel": "Annuler",
        "search": "Rechercher",
        "delete": "Supprimer",
        "decline": "Refuser",
        "play": "Jouer",
        "leaderboard": "Classement",
        "profile": "Profil",
        "login": "Connexion",
        "logout": "Déconnexion"
    },
    "forms": {
        "username": "Nom d''utilisateur",
        "password": "Mot de passe",
        "biography": "Biographie",
        "avatar": "Avatar",
        "search_placeholder": "Rechercher..."
    },
    "titles": {
        "settings": "Paramètres",
        "register": "Inscription",
        "login": "Connexion",
        "local_pong": "Pong Local",
        "remote_pong": "Pong Distant",
        "tournament": "Tournoi",
        "leaderboard": "Classement",
        "home": "Accueil"
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
        "notif_placeholder": "Pas de nouvelles notifications"
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
        "farm": "Ferme",
        "forest": "Forêt",
        "under_water": "Sous l''eau"
    },
    "error": {
        "username_error": "Nom d''utilisateur ou mot de passe invalide.",
        "password_error": "Le mot de passe doit contenir au moins 8 caractères."
    },
    "lobby": {
        "local": "Local 1vs1",
        "remote": "Distant 1vs1",
        "tournament": "Tournoi"
    }
}'
);

-- 3. Spanish (es)
INSERT INTO language_packs (language_code, pack_json) VALUES (
    'es',
    '{
    "buttons": {
        "submit": "Enviar",
        "cancel": "Cancelar",
        "search": "Buscar",
        "delete": "Eliminar",
        "decline": "Rechazar",
        "play": "Jugar",
        "leaderboard": "Clasificación",
        "profile": "Perfil",
        "login": "Iniciar sesión",
        "logout": "Cerrar sesión"
    },
    "forms": {
        "username": "Nombre de usuario",
        "password": "Contraseña",
        "biography": "Biografía",
        "avatar": "Avatar",
        "search_placeholder": "Buscar..."
    },
    "titles": {
        "settings": "Configuración",
        "register": "Registrarse",
        "login": "Iniciar sesión",
        "local_pong": "Pong Local",
        "remote_pong": "Pong Remoto",
        "tournament": "Torneo",
        "leaderboard": "Clasificación",
        "home": "Inicio"
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
        "notif_placeholder": "No hay notificaciones nuevas"
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
        "farm": "Granja",
        "forest": "Bosque",
        "under_water": "Bajo el agua"
    },
    "error": {
        "username_error": "Nombre de usuario o contraseña inválidos.",
        "password_error": "La contraseña debe tener al menos 8 caracteres."
    },
    "lobby": {
        "local": "Local 1vs1",
        "remote": "Remoto 1vs1",
        "tournament": "Torneo"
    }
}'
);