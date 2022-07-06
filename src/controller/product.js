const Product = require('../models/product');
const ProductGroupController = require('../models/product_group');
const slugify = require('slugify');
const ApiError = require('../error/errorHandler');
const {
    Types: { ObjectId },
} = require('mongoose');
class ProductController extends ProductGroupController {
    constructor() {
        super();
        this.createSingleProduct = this.createSingleProduct.bind(this);
    }
    async getAllProducts(req, res, next) {
        try {
            const { categoryId } = req.params;

            // const items = await Product.find({
            //     $or: [{ attribute: '614776ed5983a513b8f59d5d' }, { attribute: '61495cdc20f84326cc668c02' }],
            // });
            const items = await Product.aggregate([
                {
                    $match: {
                        // $or: [
                        //     { attribute: ObjectId('626eb9363de424351c27a6ad') },
                        //     { attribute: ObjectId('61495cdc20f84326cc668c02') },
                        // ],
                    },
                },
                {
                    $group: {
                        _id: '$group',
                        name: { $first: '$name' },
                        group: { $first: '$group' },
                        attribute: { $first: '$attribute' },
                    },
                },
                { $skip: 0 },
                // {
                //     $count: 'total',
                // },
            ]);
            //  await Product.populate(items, 'attribute');
            return res.status(200).json(items);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async createSingleProduct(req, res, next) {
        try {
            const {
                name,
                slug,
                options,
                price,
                amount,
                seo_title,
                seo_description,
                seo_keywords,
                thumb,
                gallery,
                vendore_code,
                size_box,
                weight_box,
                attribute,
                is_single_product,
            } = req.body;
            //при создании продукта без опций создаем товар и группу товаров,
            //требуется для коректной работы выборки, котороая основывается на группировке товаров по полю group
            if (is_single_product && options.lenght === 0) {
                const productGroup = await this.createSingleProductGroup(req, res, next);
                const newProduct = await Product({
                    name,
                    slug:
                        slug ||
                        slugify(name, {
                            lower: true,
                            remove: /[*+~()'"!:@]/g,
                        }),
                    price: price,
                    amount: amount || 0,
                    seo_title: seo_title || null,
                    seo_description: seo_description || null,
                    seo_keywords: seo_keywords || null,
                    thumb: thumb || null,
                    gallery: gallery || [],
                    vendore_code,
                    size_box,
                    weight_box,
                    attribute,
                    group: productGroup._id,
                }).save();
            }
            return res.status(201).json(newProduct);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async createMocData(req, res, next) {
        try {
            const items = await Product.insertMany([
                { name: 'prod_1', attribute: '614776ed5983a513b8f59d5d', group: '1w' },
                { name: 'prod_2', attribute: '61495cd720f84326cc668c01', group: '2w' },
                { name: 'prod_3', attribute: '61495cdc20f84326cc668c02', group: '3w' },
                { name: 'prod_11', attribute: '626eb9363de424351c27a6ad', group: '1w' },
                { name: 'prod_21', attribute: '626ebdbe00b5de1778789e67', group: '2w' },
                { name: 'prod_31', attribute: '626f8d166931200b1c31c5ea', group: '3w' },
                { name: 'prod_4', attribute: '626f8d166931200b1c31c5ea', group: null },
            ]);
            return res.status(201).json(items);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
}
module.exports = new ProductController();
