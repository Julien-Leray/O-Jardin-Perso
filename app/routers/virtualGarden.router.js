import express from 'express';
import Controller from "../controllers/virtualGarden.controller.js";

const router = express.Router();

router.route('/').get(Controller.getVirtualGarden);
router.route('/').post(Controller.addProduct);
router.route('/:id').delete(Controller.removeProduct);
router.route('/:id').patch(Controller.updateProduct);

export default router;