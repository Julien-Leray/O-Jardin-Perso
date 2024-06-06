import CoreDatamapper from './coreDatamapper.js';
import client from './pg.client.js';

class FavoritesDatamapper extends CoreDatamapper {
  constructor() {
    super('user_has_product');
  }

  async getUserById(userId) {
    const query = `SELECT * FROM "user" WHERE id = $1`;
    const { rows } = await client.query(query, [userId]);
    return rows[0];
  }

  async getAllFavoritesWithUserData(userId) {
    const query = `SELECT get_user_and_products($1) AS result`;
    const { rows } = await client.query(query, [userId]);
    return rows;
  }

  async getOneFavorite(userId, productToAdd) {
    const query = `SELECT * FROM user_has_product WHERE user_id = $1 AND product_id = $2`;
    const { rows } = await client.query(query, [userId, productToAdd]);
    return rows;
  }

  async addFavorite(productToAdd, userId) {
    const query = `INSERT INTO user_has_product(product_id, user_id) VALUES ($1, $2) RETURNING *`;
    const { rows } = await client.query(query, [productToAdd, userId]);
    return rows[0];
  }

  async removeFavorite(userId, productToRemove) {
    const query = 'DELETE FROM user_has_product WHERE user_id = $1 AND product_id = $2';
    await client.query(query, [userId, productToRemove]);
  }
}

export default new FavoritesDatamapper();
