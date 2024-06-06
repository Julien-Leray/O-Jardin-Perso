import CoreDatamapper from "./coreDatamapper.js";
import client from './pg.client.js';

class ConnectionDatamapper extends CoreDatamapper {
  constructor() {
    super('"user"');
  }

  async findByEmail(email) {
    const query = `SELECT * FROM "user" WHERE email = $1`;
    const { rows } = await client.query(query, [email]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }
}

export default new ConnectionDatamapper();
