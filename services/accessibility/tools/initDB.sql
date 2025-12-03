-- Drop the old table if it exists
DROP TABLE IF EXISTS language_packs;

CREATE TABLE
    language_packs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language_code TEXT UNIQUE NOT NULL, -- 'en', 'fr', 'es'
        pack_json TEXT NOT NULL -- The huge JSON string containing the whole dictionary
    );

INSERT INTO
    language_packs (language_code, pack_json)
VALUES
    (
        'en',
        '{
    "common": { "submit": "Submit", "cancel": "Cancel", "search": "Search", "delete": "Delete" },
    "forms": { "username": "Username", "password": "Password", "biography": "Biography", "avatar": "Avatar", "search_placeholder": "Search..." },
    "game": { "ball_speed": "Ball Speed", "paddle_size": "Paddle Size", "paddle_speed": "Paddle Speed", "opponent": "Opponent", "start": "Start Game", "local": "Local Pong", "remote": "Remote Pong" },
    "titles": { "settings": "Settings", "register": "Register", "login": "Login", "local_pong": "Local Pong", "remote_pong": "Remote Pong", "tournament": "Tournament" }
}'
    );

INSERT INTO
    language_packs (language_code, pack_json)
VALUES
    (
        'fr',
        '{
    "common": { "submit": "Valider", "cancel": "Annuler", "search": "Rechercher", "delete": "Supprimer" },
    "forms": { "username": "Nom d''utilisateur", "password": "Mot de passe", "biography": "Biographie", "avatar": "Avatar", "search_placeholder": "Rechercher..." },
    "game": { "ball_speed": "Vitesse de balle", "paddle_size": "Taille raquette", "paddle_speed": "Vitesse raquette", "opponent": "Adversaire", "start": "Commencer", "local": "Pong Local", "remote": "Pong Distant" },
    "titles": { "settings": "Paramètres", "register": "Inscription", "login": "Connexion", "local_pong": "Pong Local", "remote_pong": "Pong Distant", "tournament": "Tournoi" }
}'
    );

INSERT INTO
    language_packs (language_code, pack_json)
VALUES
    (
        'es',
        '{
    "common": { "submit": "Enviar", "cancel": "Cancelar", "search": "Buscar", "delete": "Eliminar" },
    "forms": { "username": "Nombre de usuario", "password": "Contraseña", "biography": "Biografía", "avatar": "Avatar", "search_placeholder": "Buscar..." },
    "game": { "ball_speed": "Velocidad de la bola", "paddle_size": "Tamaño de la pala", "paddle_speed": "Velocidad de la pala", "opponent": "Oponente", "start": "Empezar", "local": "Pong Local", "remote": "Pong Remoto" },
    "titles": { "settings": "Configuración", "register": "Registrarse", "login": "Iniciar sesión", "local_pong": "Pong Local", "remote_pong": "Pong Remoto", "tournament": "Torneo" }
}'
    );

-- CREATE TABLE translations (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     word TEXT NOT NULL,            -- key or phrase identifier (e.g., 'hello')
--     language_code TEXT NOT NULL,   -- language code like 'English', 'Spanish', 'French'
--     translation TEXT NOT NULL      -- actual translated text in the given language
-- );
--UNIQUE(word, language_code) <--- check if it works
-- SELECT translation FROM translations WHERE word = 'hello' AND language_code = 'Spanish';
-- Returns: 'Hola'