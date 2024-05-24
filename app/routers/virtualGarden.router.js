import express from 'express';
import Controller from "../controllers/virtualGarden.controller.js";
import authMiddleware from '../middlewares/authentification.middleware.js';

const router = express.Router();

router.route('/').get(authMiddleware, Controller.getVirtualGarden);
router.route('/').post(authMiddleware, Controller.addProduct);
router.route('/:id').delete(authMiddleware, Controller.removeProduct);
router.route('/:id').patch(authMiddleware, Controller.updateProduct);

export default router;