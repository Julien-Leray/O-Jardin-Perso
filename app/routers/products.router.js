import express from 'express';
import Controller from "../controllers/products.controller.js";

const router = express.Router();
router.route('/').get(Controller.getProducts);
router.route('/').post(Controller.createProduct);

router.route('/:id').get(Controller.getProductById);
router.route('/:id').patch(Controller.updateProduct);
router.route('/:id').delete(Controller.deleteProduct);


export default router;
