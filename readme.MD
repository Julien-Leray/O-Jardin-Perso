# O'Jardin : Back-End

## Présentation

O'Jardin est une plateforme numérique destinée aux amateurs de jardinage. L'application permet de rechercher des fiches techniques détaillées sur divers fruits et légumes de saison. Elle utilise une application météorologique qui non seulement offre des prévisions locales, mais aussi des informations sur les phases de la lune, facilitant ainsi l'utilisation d'un calendrier lunaire pour le jardinage. Les jardiniers peuvent optimiser leurs plantations et leurs récoltes en fonction de ces données. Les utilisateurs pourront personnaliser leur potager virtuel et suivre l'évolution de leurs cultures.

## Guide d'installation

- Aprés avoir cloner le dépot, l'initialiser avec la commande npm install.
- Les migrations de la BDD sont gérées avec Sqitch. Un fichier sqitch.example est disponible afin de créer votre fichier Sqitch.conf. 
- Créer une BDD en local (ex: ojardin)
- Déployer la BDD avec la commande "sqitch deploy"
- Entrer les données en BDD avec la commande psql -d "nom de la BDD" -f data/seeding_v1.sql

