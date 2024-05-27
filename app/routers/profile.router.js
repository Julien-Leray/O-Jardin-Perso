import express from 'express';
import Controller from "../controllers/profile.controller.js";
import authMiddleware from '../middlewares/authentification.middleware.js';

const router = express.Router();

router.route('/').get(authMiddleware, Controller.getProfile);
router.route('/').patch(authMiddleware, Controller.updateProfile);
router.route('/').delete(authMiddleware, Controller.deleteProfile);

export default router;
