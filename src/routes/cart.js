const express = require('express');
const { requireSigin, userMiddleware } = require('../common-middleware');

const { addItemToCart } = require('../controller/cart');

const router = express.Router();

router.post('/user/cart', requireSigin, userMiddleware, addItemToCart);
/* router.get('/cart', getCategories); */

module.exports = router;
