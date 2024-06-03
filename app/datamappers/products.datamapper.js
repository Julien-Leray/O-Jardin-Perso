import client from './pg.client.js';

const datamapper = {

  async getAllProducts() {
    const query = 'SELECT * FROM product';
    const { rows } = await client.query(query);
    return rows;
  },

  async getProductsByCategory(category) {
    const query = `SELECT 
    product.*
  FROM 
    product 
  JOIN 
    category  ON product.category_id = category.id
  WHERE 
    category.name = $1;`

    const { rows } = await client.query(query, [category]);
    return rows;
  },

  async getProductById(id) {
    const query = 'SELECT * FROM product WHERE id = $1';
    const { rows } = await client.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },

  async createProduct(latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_tips) {
    const query = `INSERT INTO product(latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_tips) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
    const { rows } = await client.query(query, [latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_tips]);
    return rows[0];
  },

  async updateProduct(id, dataToUpdate) {
    const fields = Object.keys(dataToUpdate);
    const values = Object.values(dataToUpdate);

    values.push(id);

    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', '); 222
    const query = `UPDATE product SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

    const { rows } = await client.query(query, values);

    return rows[0];
  },

  async deleteProduct(id) {
    const query = 'DELETE FROM product WHERE id = $1';
    await client.query(query, [id]);
  }
}

export default datamapper;


