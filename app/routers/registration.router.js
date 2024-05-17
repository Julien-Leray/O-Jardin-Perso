import express from 'express';
import Controller from "../controllers/registration.controller.js";

const router = express.Router();

router.route('/').post(Controller.registration);

export default router;

