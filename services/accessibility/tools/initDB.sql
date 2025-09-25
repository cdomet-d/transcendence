CREATE TABLE translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,            -- key or phrase identifier (e.g., 'hello')
    language_code TEXT NOT NULL,   -- language code like 'en', 'es', 'fr'
    translation TEXT NOT NULL      -- actual translated text in the given language
);

-- SELECT translation FROM translations WHERE word = 'hello' AND language_code = 'es';
-- Returns: 'Hola'