import client from './pg.client.js';

class CoreDatamapper {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async getAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    const { rows } = await client.query(query);
    return rows;
  }

  async getById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const { rows } = await client.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }

  async create(data) {
    const fields = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await client.query(query, values);
    return rows[0];
  }

  async update(id, dataToUpdate) {
    const fields = Object.keys(dataToUpdate);
    const values = Object.values(dataToUpdate);

    values.push(id);
    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

    const { rows } = await client.query(query, values);
    return rows[0];
  }

  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    await client.query(query, [id]);
  }
}

export default CoreDatamapper;
