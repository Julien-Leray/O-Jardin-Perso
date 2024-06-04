import express from 'express';
import viewController from '../controllers/view.controller.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';
import authMiddleware from '../middlewares/authentification.middleware.js';

const router = express.Router();

router.get('/gestion', viewController.renderGestionPage);



export default router;