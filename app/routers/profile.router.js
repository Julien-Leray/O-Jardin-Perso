import express from 'express';
import Controller from "../controllers/profile.controller.js";
import authMiddleware from '../middlewares/authentification.middleware.js';

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
 * @property {boolean} forecast_alert - The user forecast alert status, false by default
 */

const router = express.Router();

/**
 * GET api/me/profile
 * @summary Get the user profile
 * @tags Profile
 * @param {string} Authorization.header.required - The token to authenticate
 * @returns {User} 200 - The user profile
 * @returns {ApiError} 400 - No profile found
 * @returns {ApiError} 401 - Unauthorized
 * @returns {ApiError} 500 - Internal server error
 */

/**
 * PATCH api/me/profile
 * @summary Update the user profile
 * @tags Profile
 * @param {User} request.body.required - The user profile to update
 * @param {string} Authorization.header.required - The token to authenticate
 * @returns {User} 200 - The user profile updated
 * @returns {ApiError} 400 - Missing fields
 * @returns {ApiError} 401 - Unauthorized
 * @returns {ApiError} 500 - Internal server error
 */

/**
 * DELETE api/me/profile
 * @summary Delete the user profile
 * @tags Profile
 * @param {string} Authorization.header.required - The token to authenticate
 * @returns {string} 204 - Profile deleted
 * @returns {ApiError} 401 - Unauthorized
 * @returns {ApiError} 500 - Internal server error
 */

router.route('/').get(authMiddleware, Controller.getProfile);
router.route('/').patch(authMiddleware, Controller.updateProfile);
router.route('/').delete(authMiddleware, Controller.deleteProfile);

export default router;
