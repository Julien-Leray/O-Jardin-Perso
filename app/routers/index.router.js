import express from 'express';
import productsRouter from './products.router.js';
import connectionRouter from './connection.router.js';
import registrationRouter from './registration.router.js';
import tutorialsRouter from './tutorials.router.js';
import userGardenRouter from './userGarden.router.js';
import adminRouter from './admin.router.js';

const router = express.Router();

router.use((_, res, next) => {
  res.format = 'json';
  next();
});

router.use('/', adminRouter);
router.use('/products', productsRouter);
router.use('/login', connectionRouter);
router.use('/registration', registrationRouter);
router.use('/tutorials', tutorialsRouter);
router.use('/me/garden', userGardenRouter);

export default router;
