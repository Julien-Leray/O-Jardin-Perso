import express from 'express';
import Controller from "../controllers/registration.controller.js";

const router = express.Router();

router.route('/').post(Controller.registration);
router.route('/email').post(Controller.doesEmailExist);

export default router;

