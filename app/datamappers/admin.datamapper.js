import CoreDatamapper from './coreDatamapper.js';
import client from './pg.client.js';

class UserDatamapper extends CoreDatamapper {
  constructor() {
    super('"user"');
  }

  async getUserByEmail(email) {
    const query = 'SELECT * FROM "user" WHERE email = $1';
    const { rows } = await client.query(query, [email]);
    return rows[0];
  }
}

export default new UserDatamapper();