const express = require('express');
const env = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const i18next = require('i18next');
const serverTranslaetionFs = require('i18next-fs-backend');
const translationMiddleware = require('i18next-http-middleware');
const cookieParser = require('cookie-parser');

//routes
const authRoutes = require(path.join(__dirname, '/src/routes/auth'));
const adminRoutes = require(path.join(__dirname, '/src/routes/admin/auth'));
const categoryRoutes = require(path.join(__dirname, '/src/routes/category'));
const productRoutes = require(path.join(__dirname, '/src/routes/product'));
const attributeGroupRoute = require(path.join(__dirname, '/src/routes/attribute_group'));
const attributeRoute = require(path.join(__dirname, '/src/routes/attribute'));
const cartRoutes = require(path.join(__dirname, '/src/routes/cart'));
const galleryRoute = require(path.join(__dirname, '/src/routes/gallery'));

//enviroment variable
env.config();

// translation config
i18next
    .use(serverTranslaetionFs)
    .use(translationMiddleware.LanguageDetector)
    .init({
        fallbackLng: 'ru',
        backend: {
            loadPath: './locales/{{lng}}/translation.json',
        },
    });
app.use(translationMiddleware.handle(i18next));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', attributeGroupRoute);
app.use('/api', attributeRoute);
app.use('/api', cartRoutes);
app.use('/api', galleryRoute);

const start = async () => {
    try {
        //db connection
        await mongoose
            .connect(
                `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PAS}@cluster0.m9iu0.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                }
            )
            .then(() => {
                console.log('db connect');
            });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();
