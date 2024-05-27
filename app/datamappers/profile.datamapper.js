import client from './pg.client.js';

const datamapper = {
  async getProfile(userId) {
    const query = `SELECT * FROM "user" WHERE id = $1`;
    const { rows } = await client.query(query, [userId]);
    return rows[0];
  },

  async updateProfile(profile, userId) {
    const fiels = Object.keys(profile);
    const values = Object.values(profile);
    values.push(userId);

    const setClause = fiels.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
    const query = `UPDATE "user" SET ${setClause} WHERE id = $${fiels.length + 1} RETURNING *`;
    console.log(query);
    const { rows } = await client.query(query, values);
    return rows[0];
  },

  async deleteProfile(userId) {
    const query = `DELETE FROM "user" WHERE id = $1`;
    await client.query(query, [userId]);
  }
};

export default datamapper;
