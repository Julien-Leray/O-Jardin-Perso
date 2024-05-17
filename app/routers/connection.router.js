import express from 'express';
import Controller from "../controllers/connection.controller.js";

const router = express.Router();

router.route('/').post(Controller.login);

export default router;
