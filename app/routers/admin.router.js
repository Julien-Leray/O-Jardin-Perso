import express from 'express';
import adminController from '../controllers/admin.controller.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';
import authMiddleware from '../middlewares/authentification.middleware.js';

const router = express.Router();

router.get('/gestion', adminController.renderAdminPage);
router.get('/users', authMiddleware, isAdmin, adminController.getAllUsers);
router.get('/users/:id', authMiddleware, isAdmin, adminController.getOneUser);
router.post('/users', authMiddleware, isAdmin, adminController.createUser);
router.patch('/users/:id', authMiddleware, isAdmin, adminController.updateUser);
router.delete('/users/:id', authMiddleware, isAdmin, adminController.deleteUser);

export default router;