
import app from "./app/index.app.js";
import { exec } from 'child_process';
import util from 'util';
import request from 'supertest';


const execPromise = util.promisify(exec);


let server;
global.authToken;

export const mochaHooks = {

  // Fonction qui se lance avant l'ensemble des tests
  async beforeAll() {
    try {
      // Exécute `sqitch deploy` pour appliquer les migrations
      await execPromise('sqitch deploy db:pg:ojardin_test');
      console.log('Migrations appliquées avec succès');

      // Lance un serveur de test
      server = await app.listen(process.env.PORT);

      let authToken;

      // Fonction pour générer le token
      const generateToken = async () => {
        const connectData = {
          email: 'admin@admin.com',
          password: 'admin'
        }

        const response = await request(app)
          .post('/api/login')
          .send(connectData);

        const token = response.body.token;
        return token;
      };

      // Avant les tests, générer le token

      global.authToken = await generateToken();


    } catch (error) {
      console.error('Erreur lors de la configuration avant les tests :', error);
      throw error;
    }
  },

  // Fonction qui se lance après l'ensemble des tests
  async afterAll() {
    // On ferme le serveur de test
    await server.close();
    try {
      // Exécute `sqitch revert` pour supprimer les migrations
      await execPromise('sqitch revert -y db:pg:ojardin_test');
      console.log('Migrations supprimées avec succès');
    } catch (error) {
      console.error('Erreur lors de la configuration après les tests :', error);
      throw error;
    }

  },

};