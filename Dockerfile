FROM node:20.12.2

# Installer les dépendances nécessaires pour Sqitch et PostgreSQL
RUN apt-get update && apt-get install -y postgresql-client \
    && curl -L https://cpanmin.us | perl - App::cpanminus \
    && cpanm --quiet --notest App::Sqitch \
    && cpanm --quiet --notest DBD::Pg

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Créer le fichier de configuration sqitch.conf
RUN echo "[core]" > sqitch.conf && \
    echo "engine = pg" >> sqitch.conf && \
    echo "top_dir = migrations" >> sqitch.conf && \
    echo "[engine \"pg\"]" >> sqitch.conf && \
    echo "target = db:pg:ojardin" >> sqitch.conf

# Définir les variables d'environnement constantes
ENV PORT=4000
ENV PGDATABASE=ojardin
ENV PGPASSWORD=ojardin
ENV PGUSER=ojardin
ENV JWT_SECRET=ojardin
ENV API_BASE_URL=/api/api

# Exposer le port sur lequel l'application tourne
EXPOSE 4000

# Commande par défaut pour démarrer l'application
CMD ["sh", "-c", "sqitch deploy && node index.js"]
