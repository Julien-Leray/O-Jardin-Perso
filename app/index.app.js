import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import router from './routers/index.router.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));

app.use(router);

router.use(notFoundMiddleware);

export default app;
