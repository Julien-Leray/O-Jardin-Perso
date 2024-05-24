import express from 'express';
import Controller from "../controllers/alerts.controller.js";
import authMiddleware from '../middlewares/authentification.middleware.js';

const router = express.Router();

router.route('/').get(authMiddleware, Controller.getAlerts);
router.route('/').patch(authMiddleware, Controller.updateAlert);

export default router;