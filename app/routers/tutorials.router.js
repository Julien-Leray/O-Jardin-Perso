import express from 'express';
import Controller from "../controllers/tutorials.controller.js"
import isAdmin from '../middlewares/isAdmin.middleware.js';

/**
 * A tutorial object received from the API
 * @typedef {object} Tutorial
 * @property {string} title - The tutorial title
 * @property {string} article - The tutorial article
 * @property {string} picture - The tutorial picture
 * @property {string} theme - The tutorial theme
 * @property {number} id - The tutorial id
 * @property {string} created_at - The tutorial creation date
 * @property {string} updated_at - The tutorial update date
 */

/**
 * A tutorial object to send to the API
 * @typedef {object} TutorialToSend
 * @property {string} title - The tutorial title
 * @property {string} article - The tutorial article
 * @property {string} picture - The tutorial picture
 * @property {string} theme - The tutorial theme
 */

/**
 * An api success object
 * @typedef {object} ApiSuccess
 * @property {string} status - The Json status Property
 * @property {Tutorial} data - The tutorial data
 */

/**
 * A api error object
 * @typedef {object} ApiError
 * @property {string} status - The Json status Property
 * @property {string} message - Error description
 */


const router = express.Router();

/**
 * GET api/tutorials
 * @summary Get all tutorials
 * @tags Tutorials
 * @returns {Array.<Tutorial>} 200 - An array of tutorial objects
 * @returns {ApiError} 500 - Internal server error
 * @returns {ApiError} 404 - Tutorials not found
 */

/**
 * GET api/tutorials/{id}
 * @summary Get a tutorial by id
 * @tags Tutorials
 * @param {number} id.path - Tutorial id
 * @returns {Tutorial} 200 - A tutorial object
 * @returns {ApiError} 500 - Internal server error
 * @returns {ApiError} 404 - Tutorial not found
 */

/**
 * POST api/tutorials
 * @summary Create a new tutorial
 * @tags Tutorials
 * @param {TutorialToSend} request.body.required - The tutorial object
 * @param {string} token.header.required - The token to authenticate
 * @returns {ApiSuccess} 200 - The created tutorial object
 * @returns {ApiError} 500 - Internal server error
 * @returns {ApiError} 400 - All fields are required
 */

/**
 * PATCH api/tutorials/{id}
 * @summary Update a tutorial
 * @tags Tutorials
 * @param {number} id.path - Tutorial id
 * @param {string} token.header.required - The token to authenticate
 * @param {TutorialToSend} request.body.required - The tutorial object with at least one field to update
 * @returns {ApiSuccess} 200 - The updated tutorial object
 * @returns {ApiError} 500 - Internal server error
 * @returns {ApiError} 404 - Tutorial not found or no changes made
 */

/**
 * DELETE api/tutorials/{id}
 * @summary Delete a tutorial
 * @tags Tutorials
 * @param {number} id.path - Tutorial id
 * @param {string} token.header.required - The token to authenticate
 * @returns {ApiSuccess} 204 - Tutorial deleted
 * @returns {ApiError} 500 - Internal server error
 * @returns {ApiError} 404 - Tutorial not found
 */

router.route('/').get(Controller.getTutorials);
router.route('/:id').get(Controller.getTutorialById);
router.route('/').post(isAdmin, Controller.createTutorial);
router.route('/:id').patch(isAdmin, Controller.updateTutorial);
router.route('/:id').delete(isAdmin, Controller.deleteTutorial);

export default router;
