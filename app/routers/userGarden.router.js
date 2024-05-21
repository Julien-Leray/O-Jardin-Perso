import express from 'express';
import Controller from "../controllers/userGarden.controller.js";

const router = express.Router();

router.route('/').get(Controller.getFavorites);
router.route('/').post(Controller.addFavorite);
router.route('/:id').delete(Controller.removeFavorite);

export default router;
