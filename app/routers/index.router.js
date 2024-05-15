import express from 'express';
import productsRouter from './products.router.js';

const router = express.Router();

router.use((_, res, next) => {
  res.format = 'json';
  next();
});

router.use('/products', productsRouter);

export default router;
