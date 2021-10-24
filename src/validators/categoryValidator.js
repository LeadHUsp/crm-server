const Category = require('../models/category');

class CategoryValidator {
    async createCategoryValidator(req, res, next) {
        const { name, slug } = req.body;
        try {
            const categoryWithName = await Category.findOne({ name: name }).exec();
            const categoryWithSlug = slug && (await Category.findOne({ slug: slug }).exec());
            let errors = {};
            if (categoryWithName || categoryWithSlug) {
                if (categoryWithName) errors['name'] = req.t('error_name_category');
                if (categoryWithSlug) errors['slug'] = req.t('error_slug_category');

                return res.status(500).send(errors);
            }
            next();
        } catch (error) {
            return res.status(500).send(error);
        }
    }
    async updateCategoryValidator(req, res, next) {
        const { name, slug } = req.body;
        const { itemId } = req.params;
        try {
            const categoryWithName = await Category.findOne({
                $and: [{ _id: { $ne: itemId } }, { name: name }],
            }).exec();
            const categoryWithSlug =
                slug &&
                (await Category.findOne({
                    $and: [{ _id: { $ne: itemId } }, { slug: slug }],
                }).exec());
            let errors = {};
            if (categoryWithName || categoryWithSlug) {
                if (categoryWithName) errors['name'] = req.t('error_name');
                if (categoryWithSlug) errors['slug'] = req.t('error_slug');

                return res.status(500).send(errors);
            }
            next();
        } catch (error) {
            return res.status(500).send(error);
        }
    }
}
module.exports = new CategoryValidator();
