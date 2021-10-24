const express = require('express');

const { requireSigin, adminMiddleware } = require('../common-middleware');

const ProductController = require('../controller/product');

const router = express.Router();

router.get('/product', ProductController.getAllProducts);
// router.get('/category/:itemId', categoryController.getSingleCategoryItem);
router.post('/product/', ProductController.createSingleProduct);
// router.put(
//     '/category/:itemId',
//     requireSigin,
//     adminMiddleware,

//     categoryController.updateSingleCategoryItem
// );
// router.delete('/category/:itemId', requireSigin, adminMiddleware, categoryController.deleteSingleCategoryItem);

module.exports = router;
