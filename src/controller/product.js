const Product = require('../models/product');
const slugify = require('slugify');
const ApiError = require('../error/errorHandler');

class ProductController {
    constructor() {}
    async getAllProducts(req, res, next) {
        try {
            const items = await Product.find({
                $or: [{ options: { $elemMatch: { attribute: '614776ed5983a513b8f59d5d' } } }],
            }).exec();
            return res.status(201).json(items);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async createSingleProduct(req, res, next) {
        try {
            const product = new Product(req.body);
            const newProduct = await product.save();
            return res.status(201).json(newProduct);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
}
module.exports = new ProductController();
