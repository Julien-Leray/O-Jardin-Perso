import express from 'express';
import Controller from "../controllers/products.controller.js";
import isAdmin from '../middlewares/isAdmin.middleware.js';
import authMiddleware from '../middlewares/authentification.middleware.js';

/**

 * A product object received from the API
 * @typedef {object} Product
 * @property {string} name - The product name
 * @property {string} latin_name - The product latin name
 * @property {string} picture - The product picture
 * @property {string} plantation_date - The product plantation date
 * @property {string} harvest_date - The product harvest date
 * @property {string} soil_type - The product soil type
 * @property {string} diseases - The product diseases
 * @property {string} watering_frequency - The product watering frequency
 * @property {string} description - The product description
 * @property {string} sowing_tips - The product sowing tips
 * @property {number} category_id - The product category id
 * @property {number} id - The product id
 * @property {string} created_at - The product creation date
 * @property {string} updated_at - The product update date
 */

/**
 * A product object to send to the API
 * @typedef {object} ProductToSend
 * @property {string} name - The product name
 * @property {string} latin_name - The product latin name
 * @property {string} picture - The product picture
 * @property {string} plantation_date - The product plantation date
 * @property {string} harvest_date - The product harvest date
 * @property {string} soil_type - The product soil type
 * @property {string} diseases - The product diseases
 * @property {string} watering_frequency - The product watering frequency
 * @property {string} description - The product description
 * @property {string} sowing_tips - The product sowing tips
 */

const router = express.Router();

/**
 * GET api/products
 * @summary Get all products
 * @tags Products
 * @returns {Array.<Product>} 200 - An array of products
 * @returns {ApiError} 404 - No products found
 * @returns {ApiError} 400 - Invalid category
 */

/** 
 * GET api/products?category={category}
 * @summary Get all products of a specific category
 * @tags Products
 * @param {string} category.query.required - The category name
 * @returns {Array.<Product>} 200 - An array of products
 * @returns {ApiError} 404 - No products found
 * @returns {ApiError} 400 - Invalid category
 */

/** 
 * POST api/products
 * @summary Create a new product
 * @tags Products
 * @param {ProductToSend} request.body.required - The new product
 * @param {string} Authorization.header.required - Bearer token
 * @returns {Product} 200 - The new product
 * @returns {ApiError} 400 - All fields are required
 * @returns {ApiError} 500 - Error during image saving
 */

/**
 * GET api/products/{id}
 * @summary Get a product by its id
 * @tags Products
 * @param {number} id.path.required - The product id
 * @returns {Product} 200 - The product
 * @returns {ApiError} 400 - Invalid id
 * @returns {ApiError} 404 - Product not found
 */

/**
 * PATCH api/products/{id}
 * @summary Update a product by its id
 * @tags Products
 * @param {number} id.path.required - The product id
 * @param {string} Authorization.header.required - Bearer token
 * @param {ProductToSend} request.body.required - The product to update with at least one field
 * @returns {Product} 200 - The updated product
 * @returns {ApiError} 400 - Invalid id
 * @returns {ApiError} 400 - All fields are required
 * @returns {ApiError} 404 - Product not found
 */

/**
 * DELETE api/products/{id}
 * @summary Delete a product by its id
 * @tags Products
 * @param {number} id.path.required - The product id
 * @param {string} Authorization.header.required - Bearer token
 * @returns {ApiError} 204 - Product deleted
 * @returns {ApiError} 400 - Invalid id
 */

router.route('/').get(Controller.getProducts);
router.route('/').post(authMiddleware, isAdmin, Controller.createProduct);

router.route('/:id').get(Controller.getProductById);
router.route('/:id').patch(authMiddleware, isAdmin, Controller.updateProduct);
router.route('/:id').delete(authMiddleware, isAdmin, Controller.deleteProduct);

export default router;
