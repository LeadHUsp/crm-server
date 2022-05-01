const AttributeGroup = require('../models/attribute_group');

class AttrGroupValidator {
    async createItemValidator(req, res, next) {
        const { name_admin, slug } = req.body;
        const { itemId } = req.params;
        try {
            const itemWithName = await AttributeGroup.findOne({ name_admin: name_admin }).exec();
            const itemWithSlug = slug && (await AttributeGroup.findOne({ slug: slug }).exec());
            let errors = {};
            if (itemWithName || itemWithSlug) {
                if (itemWithName) errors['name_admin'] = req.t('error_name_attrgroup');
                if (itemWithSlug) errors['slug'] = req.t('error_slug_attrgroup');

                return res.status(500).send(errors);
            }
            next();
        } catch (error) {
            return res.status(500).send(error);
        }
    }
    async updateItemValidator(req, res, next) {
        const { name_admin, slug } = req.body;
        const { itemId } = req.params;
        try {
            const itemWithName = await AttributeGroup.findOne({
                $and: [{ _id: { $ne: itemId } }, { name_admin: name_admin }],
            }).exec();
            const itemWithSlug =
                slug &&
                (await AttributeGroup.findOne({
                    $and: [{ _id: { $ne: itemId } }, { slug: slug }],
                }).exec());
            let errors = {};
            if (itemWithName || itemWithSlug) {
                if (itemWithName) errors['name_admin'] = req.t('error_name_attrgroup');
                if (itemWithSlug) errors['slug'] = req.t('error_slug_attrgroup');

                return res.status(500).send(errors);
            }
            next();
        } catch (error) {
            return res.status(500).send(error);
        }
    }
}
module.exports = new AttrGroupValidator();
