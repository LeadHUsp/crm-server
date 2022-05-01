const Attribute = require('../models/attribute');
const AttributeGroup = require('../models/attribute_group');
const CrudController = require('./crud_controller');
const ApiError = require('../error/errorHandler');

class AttributeController extends CrudController {
    constructor() {
        super();
    }

    async createAttributes(attrArr, next) {
        try {
            const res = await Attribute.insertMany(attrArr);
            return res;
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async updateSingleAttribute({ _id, value, slug, attrGroup, next }) {
        try {
            if (_id !== undefined) {
                const res = await Attribute.findByIdAndUpdate(
                    _id,
                    { slug, value, attribute_group: attrGroup },
                    { new: true }
                );
                return res;
            } else {
                const res = await Attribute.create({
                    value,
                    slug,
                    attribute_group: attrGroup,
                });
                await AttributeGroup.findByIdAndUpdate(attrGroup, { $push: { attribute: res._id } });
                return res;
            }
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async deleteSingleAttribute(itemId, next) {
        try {
            const attr = await Attribute.findById(itemId);

            const newAttrGroup = await Attribute.deleteOne({ _id: itemId })
                .then(async (res) => {
                    const attrGroup = await AttributeGroup.findById(attr.attribute_group).catch((error) =>
                        next(ApiError.internal(error.message))
                    );
                    const updatedAttrArray = attrGroup.attribute.filter((item) => String(item) !== String(itemId));
                    const newAttrGroup = await AttributeGroup.findByIdAndUpdate(
                        attrGroup._id,
                        {
                            attribute: updatedAttrArray,
                        },
                        { new: true }
                    )
                        .then((res) => res)
                        .catch((error) => next(ApiError.internal(error.message)));
                })
                .catch((error) => next(ApiError.internal(error.message)));
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
}
module.exports = AttributeController;
