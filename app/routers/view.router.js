import express from 'express';
import viewController from '../controllers/view.controller.js';
const router = express.Router();

router.get('/', viewController.renderGestionPage);



export default router;