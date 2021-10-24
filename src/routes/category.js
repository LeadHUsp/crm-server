const express = require('express');

const { requireSigin, adminMiddleware } = require('../common-middleware');
const categoryValidator = require('../validators/categoryValidator');

const categoryController = require('../controller/category');

const router = express.Router();

router.get('/category', categoryController.getAllCategoryItems);
router.get('/category/:itemId', categoryController.getSingleCategoryItem);
router.post(
    '/category/',
    requireSigin,
    adminMiddleware,
    categoryValidator.createCategoryValidator,
    categoryController.addNewCategoryItem
);
router.put(
    '/category/:itemId',
    requireSigin,
    adminMiddleware,
    categoryValidator.updateCategoryValidator,
    categoryController.updateSingleCategoryItem
);
router.delete('/category/:itemId', requireSigin, adminMiddleware, categoryController.deleteSingleCategoryItem);

module.exports = router;
