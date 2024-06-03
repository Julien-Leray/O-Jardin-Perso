import client from './pg.client.js';

const datamapper = {

  async getAllTutorials() {
    const query = 'SELECT * FROM tutorial';
    const { rows } = await client.query(query);
    return rows;
  },

  async getTutorialById(id) {
    const query = 'SELECT * FROM tutorial WHERE id = $1';
    const { rows } = await client.query(query, [id]);
    return rows[0];
  },

  async createTutorial(title, article, picture, theme) {
    const query = `INSERT INTO tutorial(title, article, picture, theme) VALUES ($1, $2, $3, $4) RETURNING *`;
    const { rows } = await client.query(query, [title, article, picture, theme]);
    return rows[0];
  },

  async updateTutorial(id, dataToUpdate) {
    const fields = Object.keys(dataToUpdate);
    const values = Object.values(dataToUpdate);

    values.push(id);

    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');

    const query = `UPDATE tutorial SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    console.log(query);

    const { rows } = await client.query(query, values);

    return rows[0];
  },

  async deleteTutorial(id) {
    const query = 'DELETE FROM tutorial WHERE id = $1';
    await client.query(query, [id]);
  }
};

export default datamapper;