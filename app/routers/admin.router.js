import express from 'express';
import adminController from '../controllers/admin.controller.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';
import authMiddleware from '../middlewares/authentification.middleware.js';

const router = express.Router();

router.get('/gestion', adminController.renderAdminPage);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getOneUser);
router.post('/users', adminController.createUser);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

export default router;