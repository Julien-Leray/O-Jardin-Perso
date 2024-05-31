import express from 'express';
import Controller from "../controllers/alerts.controller.js";
import authMiddleware from '../middlewares/authentification.middleware.js';

/**
 * An Alert object
 * @typedef {object} Alert
 * @property {boolean} watering_alert - The user watering alert status
 * @property {boolean} forecast_alert - The user forecast alert status
 */

const router = express.Router();

/**
 * GET api/me/alerts
 * @summary Get user alerts
 * @tags Alerts
 * @param {string} Authorization.header.required - The token to connect
 * @returns {Array.<Alert>} 200 - The user alerts
 * @returns {ApiError} 401 - Unauthorized
 * @returns {ApiError} 500 - Internal server error
 */

/**
 * PATCH api/me/alerts
 * @summary Update user alerts
 * @tags Alerts
 * @param {string} Authorization.header.required - The token to connect
 * @param {Alert} request.body.required - The alerts to update
 * @returns {Array.<Alert>} 200 - The user alerts updated
 * @returns {ApiError} 401 - Unauthorized
 * @returns {ApiError} 400 - Invalid input
 * @returns {ApiError} 500 - Internal server error
 */

router.route('/').get(authMiddleware, Controller.getAlerts);
router.route('/').patch(authMiddleware, Controller.updateAlert);

export default router;