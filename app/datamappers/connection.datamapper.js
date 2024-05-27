import client from "./pg.client.js";

const datamapper = {
  async findByEmail(email) {
    const query = 'SELECT * FROM "user" WHERE email = $1';
    const { rows } = await client.query(query, [email]);
    return rows[0];
  },


}

export default datamapper;
