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
        const productName = req.body.name.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with dashes and convert to lowercase
        const extension = path.extname(file.originalname);
        cb(null, `${productName}${extension}`);
    }
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set('views', 'app/views');

app.use('/api', router);

app.post('/api/uploadImage', (req, res, next) => {
    const formDataHandler = upload.single('image');
    formDataHandler(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return next(err);
        }
        next();
    });
}, (req, res) => {
    if (req.file) {
        res.json({ success: true, filePath: `/pictures/${req.file.filename}` });
    } else {
        res.json({ success: false });
    }
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

export default app;
