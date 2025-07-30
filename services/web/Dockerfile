FROM node:alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

# Installer TypeScript et http-server globalement
RUN npm install -g typescript http-server

# Créer le répertoire de travail avec les bonnes permissions
RUN mkdir -p /usr/app && chown -R 1000:1000 /usr/app

# Définir le répertoire de travail
WORKDIR /usr/app

# Copier d'abord package.json pour optimiser le cache Docker
COPY package.json ./

# Installer les dépendances de développement nécessaires
RUN npm install --save-dev @types/node

# Installer les dépendances du projet
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# S'assurer que les permissions sont correctes
RUN chown -R 1000:1000 /usr/app

# Compiler TypeScript vers JavaScript
RUN npx tsc

# Créer un dossier public et y copier tous les fichiers nécessaires
RUN mkdir -p public && \
    cp -r dist public/ && \
    cp index.html public/ && \
    cp style.css public/ && \
    cp -r images public/ 2>/dev/null || echo "Pas de dossier images"

# Exposer le port
EXPOSE 1212

# Changer d'utilisateur pour la sécurité
USER 1000:1000

# Servir le dossier public avec http-server
CMD ["http-server", "public", "-p", "1212", "-a", "0.0.0.0"]