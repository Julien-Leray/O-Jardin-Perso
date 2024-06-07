import CoreDatamapper from './coreDatamapper.js';
import client from './pg.client.js';

class VirtualGardenDatamapper extends CoreDatamapper {
  constructor() {
    super('user_plant_product');
  }

  async getVirtualGarden(userId) {
    const query = 'SELECT * FROM user_plant_product WHERE user_id = $1';
    const { rows } = await client.query(query, [userId]);
    return rows;
  }

  async getOneVirtualGardenProduct(userId, productId) {
    const query = 'SELECT * FROM user_plant_product WHERE user_id = $1 AND product_id = $2';
    const { rows } = await client.query(query, [userId, productId]);
    return rows[0];
  }

  async addProduct(data, userId) {
    const { token, ...dataWithoutToken } = data;
    const fields = Object.keys(dataWithoutToken);
    const values = Object.values(dataWithoutToken);

    values.push(userId);

    const query = `INSERT INTO "user_plant_product"(${fields.map(field => `"${field}"`).join(', ')}, "user_id") VALUES (${fields.map((_, index) => `$${index + 1}`).join(', ')}, $${fields.length + 1}) RETURNING *`;

    const { rows } = await client.query(query, values);
    return rows[0];
  }

  async removeProduct(userId, productToRemove, positionToRemove) {
    const query = 'DELETE FROM user_plant_product WHERE user_id = $1 AND product_id = $2 AND position = $3';
    await client.query(query, [userId, productToRemove, positionToRemove]);
  }

  async updateProduct(userId, dataToUpdate) {
    const { product_id, token, ...dataWithoutProductId } = dataToUpdate;

    const fields = Object.keys(dataWithoutProductId);
    const values = Object.values(dataWithoutProductId);

    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');

    values.push(userId, product_id);

    const query = `UPDATE user_plant_product SET ${setClause} WHERE user_id = $${fields.length + 1} AND product_id = $${fields.length + 2} RETURNING *`;

    const { rows } = await client.query(query, values);
    return rows[0];
  }
}

export default new VirtualGardenDatamapper();
