const ProductGroup = require('../models/product_group');
const slugify = require('slugify');
const ApiError = require('../error/errorHandler');
const {
    Types: { ObjectId },
} = require('mongoose');
class ProductGroupController {
    constructor() {}
    async createSingleProductGroup(req, res, next) {
        const { name, options, description, is_single_product } = req.body;
        const newProductGroup = await ProductGroup({
            name,
            options: options || [],
            description: description || null,
            is_single_product,
        }).save();
        return newProductGroup;
    }
}
module.exports = ProductGroupController;
