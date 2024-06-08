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

# Créer un script pour générer le fichier .env avec les données directement incluses
RUN echo '#!/bin/sh' > create_env.sh && \
    echo 'echo "PORT=4000" > .env' >> create_env.sh && \
    echo 'echo "PGDATABASE=ojardin" >> .env' >> create_env.sh && \
    echo 'echo "PGPASSWORD=ojardin" >> .env' >> create_env.sh && \
    echo 'echo "PGUSER=ojardin" >> .env' >> create_env.sh && \
    echo 'echo "JWT_SECRET=ojardin" >> .env' >> create_env.sh && \
    echo 'echo "API_BASE_URL=/api" >> .env' >> create_env.sh && \
    chmod +x create_env.sh

# Exposer le port sur lequel l'application tourne
EXPOSE 4000

# Commande par défaut pour démarrer l'application
CMD ["sh", "-c", "./create_env.sh && sqitch deploy && node index.js"]
