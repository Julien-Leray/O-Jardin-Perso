import express from 'express';
import Controller from "../controllers/connection.controller.js";

/**
 * A User connection object
 * @typedef {object} UserConnection
 * @property {string} email.required - The user email
 * @property {string} password.required - The user password
 */

/**
 * A User 
 * @typedef {object} User
 * @property {number} id - The user id
 * @property {string} email - The user email
 * @property {string} firstname - The user firstname
 * @property {string} lastname - The user lastname
 * @property {string} address - The user address
 * @property {string} city - The user city
 * @property {number} zip_code - The user postal_code
 * @property {string} created_at - The user creation date
 * @property {string} updated_at - The user update date
 * @property {boolean} is_admin - The user admin status
 * @property {boolean} watering_alert - The user watering alert status
 * @property {boolean} forecast_alert - The user forecast alert status
 */

/**
 * A User object received from the API
 * @typedef {object} UserConnected
 * @property {object} token - The user token
 * @property {object} user - The user connected
 */

const router = express.Router();

/**
 * POST api/connection
 * @summary Connect a user
 * @tags Connection
 * @param {UserConnection} request.body.required - The user to connect
 * @returns {UserConnected} 200 - The user connected
 * @returns {ApiError} 400 - Invalid input
 * @returns {ApiError} 500 - Internal server error
 */

router.route('/').post(Controller.login);

export default router;
