import express from 'express';
import Controller from '../controllers/products.controller.js';

const router = express.Router();

router.route('/').get(Controller.getAllProducts);

export default router;
