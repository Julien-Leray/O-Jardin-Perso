import client from './pg.client.js';

const datamapper = {
  async getUserById(id) {
    const query = 'SELECT * FROM "user" WHERE id = $1';
    const { rows } = await client.query(query, [id]);
    return rows[0];
  },

  async getUserByEmail(email) {
    const query = 'SELECT * FROM "user" WHERE email = $1';
    const { rows } = await client.query(query, [email]);
    return rows[0];
  },

  async getAllUsers() {
    const query = 'SELECT * FROM "user"';
    const { rows } = await client.query(query);
    return rows;
  },
  async createUser(userData) {
    const fields = Object.keys(userData);
    const values = Object.values(userData);

    const fieldNames = fields.map(field => `"${field}"`).join(', ');
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO "user" (${fieldNames}) VALUES (${placeholders}) RETURNING *`;

    const { rows } = await client.query(query, values);
    return rows[0];
  },

  async updateUser(id, userData) {
    const fields = Object.keys(userData);
    const values = Object.values(userData);

    const set = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');

    const query = `UPDATE "user" SET ${set} WHERE id = $${fields.length + 1} RETURNING *`;

    const { rows } = await client.query(query, [...values, id]);
    return rows[0];
  },

  async deleteUser(id) {
    const query = 'DELETE FROM "user" WHERE id = $1';
    await client.query(query, [id]);
  },
};

export default datamapper;
