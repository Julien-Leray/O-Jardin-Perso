import express from 'express';
import Controller from "../controllers/userGarden.controller.js";
import authMiddleware from '../middlewares/authentification.middleware.js';

/**
 * A favorite object received from the API
 * @typedef {object} Favorite
 * @property {string} name - The favorite name
 * @property {string} latin_name - The favorite latin name
 * @property {string} picture - The favorite picture
 * @property {string} plantation_date - The favorite plantation date
 * @property {string} harvest_date - The favorite harvest date
 * @property {string} soil_type - The favorite soil type
 * @property {string} diseases - The favorite diseases
 * @property {string} watering_frequency - The favorite watering frequency
 * @property {string} description - The favorite description
 * @property {string} sowing_tips - The favorite sowing tips
 * @property {number} category_id - The favorite category id
 * @property {number} id - The favorite id
 * @property {string} created_at - The favorite creation date
 * @property {string} updated_at - The favorite update date
 */

/**
 * A favorite object to send to the API
 * @typedef {object} FavoriteToSend
 * @property {number} product_id - The favorite product id
 */

/**
 * A favorite response with User data
 * @typedef {object} FavoriteResponse
 * @property {UserData} result - The user data
 * @property {Array.<Favorite>} products - The user favorites
 
 */

/**
 * A user data object received from the API
 * @typedef {object} UserData
 * @property {string} firstname - The user firstname
 * @property {string} lastname - The user lastname
 * @property {string} email - The user email
 * @property {number} id - The user id
 * @property {string} address - The user address
 * @property {string} city - The user city
 * @property {string} zip_code - The user postal code
 * @property {boolean} is_admin - The user admin status
 * @property {boolean} watering_alert - The user watering alert status
 * @property {boolean} forecast_alert - The user forecast alert status
 * @property {string} created_at - The user creation date
 * @property {string} updated_at - The user update date
 */

const router = express.Router();

/**
* GET api/me/garden
* @summary Get all favorites
* @tags UserGarden
* @headers Authorization - Bearer token
* @param {string} token.header.required - The token to authenticate
* @returns {Array.<FavoriteResponse>} 200 - An array of favorites
* @returns {ApiError} 404 - No favorites found
* @returns {ApiError} 400 - Invalid user
*/

/**
 * POST api/me/garden
 * @summary Add a favorite
 * @tags UserGarden
 * @param {product_id} request.body.required - The product id to add in favorites
 * @headers Authorization - Bearer token
 * @returns {Favorite} 200 - The favorite added
 * @returns {ApiError} 400 - Product to add is required
 * @returns {ApiError} 400 - Product already added to favorites
 * @returns {ApiError} 401 - Unauthorized
 */

/**
 * DELETE api/me/garden/{id}
 * @summary Remove a favorite
 * @tags UserGarden
 * @param {number} id.path - The favorite id to remove
 * @param {product_id} request.body.required - The product id to remove from favorites
 * @param {string} token.header.required - The token to authenticate
 * @returns {ApiError} 204 - Favorite removed
 * @returns {ApiError} 400 - Product to remove is required
 * @returns {ApiError} 400 - Unauthorized user
 * @returns {ApiError} 400 - Product not found in favorites
 */

router.route('/').get(authMiddleware, Controller.getFavorites);
router.route('/').post(authMiddleware, Controller.addFavorite);
router.route('/:id').delete(authMiddleware, Controller.removeFavorite);

export default router;
