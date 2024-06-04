import express from 'express';
import Controller from "../controllers/virtualGarden.controller.js";
import authMiddleware from '../middlewares/authentification.middleware.js';

/**
 * A virtual garden object
 * @typedef {object} VirtualGarden
 * @property {number} user_id - The virtual garden user id
 * @property {number} product_id - The virtual garden product id
 * @property {number} quantity - The virtual garden product quantity
 * @property {array} position - The virtual garden product position
 */

/**
 * A virtual garden object to send to the API
 * @typedef {object} VirtualGardenToSend
 * @property {number} product_id - The virtual garden product id
 * @property {number} quantity - The virtual garden product quantity
 * @property {array} position - The virtual garden product position
 */

/**
 * A virtual garden response from the API
 * @typedef {object} VirtualGardenResponse
 * @property {array.<VirtualGarden>} products - The virtual garden products
 */

const router = express.Router();

/**
 * GET /api/virtualGarden
 * @summary Get all virtual garden products
 * @tags VirtualGarden
 * @param {string} Authorization.header.required - Bearer token
 * @returns {VirtualGardenResponse} 200 - An array of virtual garden products
 * @returns {ApiError} 500 - Internal server error
 * @returns {ApiError} 404 - Virtual garden not found
 */

/**
 * POST /api/virtualGarden
 * @summary Add a product to the virtual garden
 * @tags VirtualGarden
 * @param {string} Authorization.header.required - Bearer token
 * @param {VirtualGardenToSend} request.body.required - The virtual garden product to add
 * @returns {VirtualGarden} 201 - The virtual garden product added
 * @returns {ApiError} 400 - Data to add is required
 * @returns {ApiError} 400 - Unauthorized
 * @returns {ApiError} 500 - Internal server error
 */

/**
 * DELETE /api/virtualGarden/:id
 * @summary Remove a product from the virtual garden
 * @tags VirtualGarden
 * @param {string} Authorization.header.required - Bearer token
 * @param {number} id.path.required - The virtual garden product id
 * @returns {ApiSuccess} 204 - Product removed
 * @returns {ApiError} 400 - Product to remove is required
 * @returns {ApiError} 400 - Unauthorized
 * @returns {ApiError} 500 - Internal server error
 */

/**
 * PATCH /api/virtualGarden/:id
 * @summary Update a product in the virtual garden
 * @tags VirtualGarden
 * @param {string} Authorization.header.required - Bearer token
 * @param {number} id.path.required - The virtual garden product id
 * @param {VirtualGardenToSend} request.body.required - The virtual garden product to update
 * @returns {VirtualGarden} 201 - The virtual garden product updated
 * @returns {ApiError} 400 - Data to update is required
 * @returns {ApiError} 401 - Unauthorized
 * @returns {ApiError} 404 - Product not found or no changes made
 * @returns {ApiError} 500 - Internal server error
 */

router.route('/').get(authMiddleware, Controller.getVirtualGarden);
router.route('/').post(authMiddleware, Controller.addProduct);
router.route('/:id').delete(authMiddleware, Controller.removeProduct);
router.route('/:id').patch(authMiddleware, Controller.updateProduct);

export default router;