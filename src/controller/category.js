const slugify = require('slugify');
const Category = require('../models/category');

const queryString = require('query-string');
const ApiError = require('../error/errorHandler');

class categoryController {
    constructor() {}

    async getAllCategoryItems(req, res, next) {
        try {
            const totalDocs = await Category.countDocuments({ parent_id: null });
            let { limit, page } = req.query;
            page = page || 1;
            limit = limit || 10;
            const totalPages = Math.ceil(totalDocs / limit);
            let offset = page * limit - limit;
            const allCategoryItems = await Category.find({ parent_id: null }, null, {
                skip: offset,
                limit: limit,
            })
                .populate({ path: 'category_image' })
                .exec();
            return res.status(200).json(allCategoryItems);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async getSingleCategoryItem(req, res, next) {
        try {
            const { itemId } = req.params;
            const singleCategoryItem = await Category.findById(itemId, function (error) {
                if (error) res.status(404).json({ message: 'Not found' });
            })
                .populate({ path: 'category_image' })
                .exec();
            return res.status(200).json(singleCategoryItem);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    // создание новой категории
    async addNewCategoryItem(req, res, next) {
        try {
            const categoryObj = {
                name: req.body.name,
                slug: req.body.slug ? req.body.slug : slugify(req.body.name),
                seo_title: req.body.seo_title,
                seo_description: req.body.seo_description,
                seo_keywords: req.body.seo_keywords,
                long_description: req.body.long_description,
                category_image: req.body.category_image,
                parent_id: req.body.parent_id || null,
            };
            const cat = new Category(categoryObj);
            const newCategory = await cat.save();
            if (req.body.parent_id) {
                await Category.findByIdAndUpdate(req.body.parent_id, { $push: { children: newCategory._id } });
            }

            return res.status(201).json({
                data: newCategory,
            });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async updateSingleCategoryItem(req, res, next) {
        try {
            const { itemId } = req.params;
            const { name, seo_title, seo_description, seo_keywords, long_description, parent_id, category_image } =
                req.body;
            if (req.body.category_image === '') {
                category_image = null;
            }
            const existingCategory = await Category.findById(itemId).exec();
            if (String(existingCategory.parent_id) !== parent_id) {
                const updatedCategoryItem = await Category.findByIdAndUpdate(
                    itemId,
                    {
                        name,
                        slug: slugify(name),
                        seo_title: seo_title || '',
                        seo_description: seo_description || '',
                        seo_keywords: seo_keywords || '',
                        long_description: long_description || '',
                        category_image,
                        parent_id,
                    },
                    { new: true }
                )
                    .then((res) => {
                        if (parent_id !== null) {
                            Category.findByIdAndUpdate(parent_id, { $push: { children: itemId } }).catch((error) =>
                                ApiError.internal(error.message)
                            );
                        }
                        if (existingCategory.parent_id !== null) {
                            Category.findByIdAndUpdate(existingCategory.parent_id, {
                                $pull: { children: { $in: [itemId] } },
                            }).catch((error) => ApiError.internal(error.message));
                        }
                    })
                    .catch((error) => {
                        ApiError.internal(error.message);
                    });

                return res.status(200).json(updatedCategoryItem);
            } else {
                const updatedCategoryItem = await Category.findByIdAndUpdate(
                    itemId,
                    {
                        name,
                        slug: slugify(name),
                        seo_title: seo_title || '',
                        seo_description: seo_description || '',
                        seo_keywords: seo_keywords || '',
                        long_description: long_description || '',
                        category_image,
                        parent_id,
                    },
                    { new: true }
                ).exec();

                return res.status(200).json(updatedCategoryItem);
            }
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async deleteSingleCategoryItem(req, res, next) {
        try {
            const parentCategory = await Category.find({ children: { $in: [req.params.itemId] } });
            const childCategory = await Category.find({ parent_id: { $in: [req.params.itemId] } });

            const response = await Category.deleteOne({ _id: req.params.itemId })
                .then(async (res) => {
                    if (childCategory.length > 0) {
                        const updateChildCategories = childCategory.map((item) =>
                            Category.findByIdAndUpdate(item._id, { parent_id: null }, { new: true }).exec()
                        );
                        Promise.all(updateChildCategories).catch((error) => next(ApiError.internal(error.message)));
                    }
                    if (parentCategory.length > 0) {
                        const childrenArrayModified = parentCategory[0].children.filter(
                            (item) => item._id !== req.params.itemId
                        );
                        const updateParentCategory = await Category.findByIdAndUpdate(
                            parentCategory[0]._id,
                            { children: childrenArrayModified },
                            { new: true }
                        ).exec();
                    }
                })
                .catch((error) => next(ApiError.internal(error.message)));

            // const response = await Category.deleteOne({ _id: req.params.itemId });
            return res.status(200).json(childCategory);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
}
module.exports = new categoryController();
