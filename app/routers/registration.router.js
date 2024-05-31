import express from 'express';
import Controller from "../controllers/registration.controller.js";

/**
* A User registration object
* @typedef {object} UserRegistration
* @property {string} email.required - The user email
* @property {string} password.required - The user password
* @property {string} firstname.required - The user firstname
* @property {string} lastname.required - The user lastname
* @property {string} address - The user address
* @property {string} city - The user city
* @property {number} zip_code - The user postal_code
*/

/**
 * A User object received from the API
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
 * @property {boolean} is_admin - The user admin status false by default, can be set to true only by an admin
 * @property {boolean} watering_alert - The user watering alert status, false by default
 * @property {boolean} forecast_alert - The user forecast alert status false by default
 */

const router = express.Router();

/**
 * POST api/registration
 * @summary Register a new user
 * @tags Registration
 * @param {UserRegistration} request.body.required - The user to register
 * @returns {UserRegistration} 201 - The user registered
 * @returns {ApiError} 400 - Data to add is required
 * @returns {ApiError} 400 - Email already used
 * @returns {ApiError} 400 - Invalid input
 * @returns {ApiError} 500 - Internal server error
 */

/**
 * POST api/registration/email
 * @summary Check if email already exist
 * @tags Registration
 * @param {string} email.required - The email to check
 * @returns {boolean} 200 - The email existance
 * @returns {ApiError} 500 - Internal server error
 */

router.route('/').post(Controller.registration);
router.route('/email').post(Controller.doesEmailExist);

export default router;

