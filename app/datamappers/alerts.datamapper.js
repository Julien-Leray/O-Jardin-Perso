import client from "../datamappers/pg.client.js";

const datamapper = {
  async getAllAlerts(userId) {
    const query = 'SELECT watering_alert, forecast_alert FROM "user" WHERE "id" = $1';
    const values = [userId];
    const { rows } = await client.query(query, values);
    return rows;
  },

  async updateAlert(userId, alertsToUpdate) {
    const { token, ...alerts } = alertsToUpdate;
    const alertType = Object.keys(alerts);
    const newStatus = Object.values(alerts);

    const setClause = alertType.map((type, index) => `"${type}" = $${index + 1}`).join(', ');
    newStatus.push(userId);

    const query = `UPDATE "user" SET ${setClause} WHERE "id" = $${alertType.length + 1} RETURNING *`;

    const { rows } = await client.query(query, newStatus);
    return rows[0];
  }
};

export default datamapper;