import express from 'express';
import bodyParser from 'body-parser';

import router from './routers/index.router.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json());


app.use(express.urlencoded({ extended: true }));

app.use(router);

export default app;
