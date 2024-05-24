import express from 'express';
import Controller from "../controllers/userGarden.controller.js";
import authMiddleware from '../middlewares/authentification.middleware.js';

const router = express.Router();

router.route('/').get(authMiddleware, Controller.getFavorites);
router.route('/').post(authMiddleware, Controller.addFavorite);
router.route('/:id').delete(authMiddleware, Controller.removeFavorite);

export default router;
