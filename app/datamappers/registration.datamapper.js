import client from './pg.client.js';

const datamapper = {
  async createUser(newUser) {
    const fields = Object.keys(newUser);
    const values = Object.values(newUser);

    const fieldNames = fields.map(field => `"${field}"`).join(', ');
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO "user" (${fieldNames}) VALUES (${placeholders}) RETURNING *`;

    const { rows } = await client.query(query, values);
    return rows[0];
  }
}

export default datamapper;