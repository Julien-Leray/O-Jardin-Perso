import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import multer from 'multer';
import path from 'path';
import router from './routers/index.router.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';



const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/pictures');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Renommer le fichier pour éviter les conflits
    }
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set('views', 'app/views');

app.use('/api', router);


app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

export default app;
