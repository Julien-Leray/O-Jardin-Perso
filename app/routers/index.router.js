import express from 'express';
import productsRouter from './products.router.js';
import connectionRouter from './connection.router.js';
import registrationRouter from './registration.router.js';

const router = express.Router();

router.use((_, res, next) => {
  res.format = 'json';
  next();
});

router.use('/products', productsRouter);
router.use('/login', connectionRouter);
router.use('/registration', registrationRouter);

export default router;
