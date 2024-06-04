import CoreDatamapper from './coreDatamapper.js';

class ProductDatamapper extends CoreDatamapper {
  constructor() {
    super('product');
  }

  async getProductsByCategory(category) {
    const query = `
      SELECT product.*
      FROM product 
      JOIN category ON product.category_id = category.id
      WHERE category.name = $1
    `;
    const { rows } = await client.query(query, [category]);
    return rows;
  }
}

export default new ProductDatamapper();
