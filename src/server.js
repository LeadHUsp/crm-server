const express = require('express');
const env = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const i18next = require('i18next');
const serverTranslaetionFs = require('i18next-fs-backend');
const translationMiddleware = require('i18next-http-middleware');

//routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const attributeGroupRoute = require('./routes/attribute_group');
const attributeRoute = require('./routes/attribute');
const cartRoutes = require('./routes/cart');
const galleryRoute = require('./routes/gallery');

//enviroment variable
env.config();
//db connection
mongoose
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
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', attributeGroupRoute);
app.use('/api', attributeRoute);
app.use('/api', cartRoutes);
app.use('/api', galleryRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
