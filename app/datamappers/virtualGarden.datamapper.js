import client from './pg.client.js';

const datamapper = {

  async getVirtualGarden(userId) {
    const query = 'SELECT * FROM user_plant_product WHERE user_id = $1';
    const { rows } = await client.query(query, [userId]);
    return rows;
  },

  async getOneVirtualGardenProduct(userId, productId) {
    const query = 'SELECT * FROM user_plant_product WHERE user_id = $1 AND product_id = $2';
    const { rows } = await client.query(query, [userId, productId]);
    return rows[0];
  },

  async addProduct(data, userId) {
    const { token, ...dataWithoutToken } = data;
    const fields = Object.keys(dataWithoutToken);
    const values = Object.values(dataWithoutToken);

    values.push(`${userId}`);

    const query = `INSERT INTO "user_plant_product"(${fields.map(field => `"${field}"`).join(', ')}, "user_id") VALUES (${fields.map((_, index) => `$${index + 1}`).join(', ')}, $${fields.length + 1}) RETURNING *`;
    console.log(query);
    console.log(values);
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