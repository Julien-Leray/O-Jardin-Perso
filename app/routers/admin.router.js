import express from 'express';
import Controller from "../controllers/admin.controller.js";

const router = express.Router();

router.route('/').get(Controller.renderAdminPage);

export default router;
