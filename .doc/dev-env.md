# Dev environment

## Node.js

cmd pour créer un projet node.js et obtenir le fichier *package.json* : **npm init**

dans package.json on retrouve :

- la liste de toutes les dépendances installées dans le dossier node_modules. \
 cmd pour installer un paquet : **npm install (ou juste i) *le nom du paquet*** (une fois le nom du paquet dans le fichier package.json il est possible de simplemnt faire **npm install** pour installer tous les paquets dans un nouvel environnement, cf. pong.sh)
- un ou plusieurs script qui sont lancés grace à: **npm run *nom du script*** (sauf si le nom du script est start il suffit de faire **npm start**, cf. pong.sh)

**nodemon:** 
paquet qui permet de refresh le server a chaque changement dans le code. \
Le fichier nodemon.json permet de configurer quels fichiers à watch, ignorer, leur extensions et la commande à executer à chaque refresh

## Typescript

cmd pour créer le fichier *tsconfig.json* : **npx tsc --init** \
tsc doit etre installé soit en global ou soit en local.\
cmd pour installer en local : **npm i typescript**.\
Ce fichier permet d'indiquer où sont les fichiers .ts (./src) à compiler et où mettre les fichiers .js (./dist). Il permet aussi de configurer la compilation du code.

## Tailwindcss

tailwindcss peut etre utilisé de différentes manières : <https://tailwindcss.com/docs/installation/using-vite>

Avec le CLI de tailwindcss:\
cmd pour compiler un fichier css : **npx @tailwindcss/cli -i ./static/style-src.css -o ./static/style-dist.css** \
(npx permet d'executer un paquet node.js) \
cette commande va recupérer tout le tailwind css dans nos fichiers et générer du css standard dans *./static/style-dist.css*
