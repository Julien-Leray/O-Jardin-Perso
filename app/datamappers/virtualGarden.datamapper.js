import client from './pg.client.js';

const datamapper = {

  async getVirtualGarden(userId) {
    const query = 'SELECT * FROM user_plant_product WHERE user_id = $1';
    const { rows } = await client.query(query, [userId]);
    return rows;
  },

  async addProduct(data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const query = `INSERT INTO user_plant_product(${fields.join(', ')}) VALUES (${values.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
    const { rows } = await client.query(query, values);
    return rows[0];
  },

  async removeProduct(userId, productToRemove) {
    const query = 'DELETE FROM user_plant_product WHERE user_id = $1 AND product_id = $2';
    await client.query(query, [userId, productToRemove]);

  },

  async updateProduct(userId, dataToUpdate) {
    const fields = Object.keys(dataToUpdate);
    const values = Object.values(dataToUpdate);

    values.push(userId);

    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');

    const query = `UPDATE user_plant_product SET ${setClause} WHERE user_id = $${fields.length + 1} RETURNING *`;

    const { rows } = await client.query(query, values);

    return rows[0];
  }
};

export default datamapper;