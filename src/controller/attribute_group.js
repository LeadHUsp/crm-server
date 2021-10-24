const AttributeGroup = require('../models/attribute_group');
const Attribute = require('../models/attribute');
const AttributeController = require('../controller/attribute');
const ApiError = require('../error/errorHandler');
const slugify = require('slugify');

class AttributeGroupController extends AttributeController {
    constructor() {
        super();
        this.createSingleAttributeGroup = this.createSingleAttributeGroup.bind(this);
    }
    async getAllAttributeGroup(req, res, next) {
        try {
            const { itemId } = req.params;
            let { limit, page, name } = req.query;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            let findRequest = {};
            if (name && itemId) {
                findRequest = {
                    $and: [{ $text: { $search: name } }, { product_category: itemId }],
                };
            }
            if (name && !itemId) {
                findRequest = {
                    $text: { $search: name },
                };
            }
            if (itemId && !name) {
                findRequest = {
                    product_category: itemId,
                };
            }
            const totalDocs = await AttributeGroup.countDocuments(findRequest);
            const totalPages = Math.ceil(totalDocs / limit);
            let offset = page * limit - limit;
            const attrItems = await AttributeGroup.find(findRequest, null, {
                skip: offset,
                limit: limit,
            })
                .populate('attribute')
                .populate({ path: 'product_category', select: 'name' })
                .exec();
            res.set({ 'Access-Control-Expose-Headers': 'X_TotalPages', X_TotalPages: totalPages });
            return res.status(200).json(attrItems);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async getSingleAttributeGroup(req, res, next) {
        try {
            const { itemId } = req.params;
            const singleItem = await AttributeGroup.findById(itemId).populate('attribute').exec();
            return res.status(200).json(singleItem);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async createSingleAttributeGroup(req, res, next) {
        try {
            const { name_user, name_admin, product_category, unit_text, show_in_filter, attribute } = req.body;
            const group = new AttributeGroup({
                name_user,
                name_admin,
                slug: slugify(name_admin.toLowerCase()),
                product_category,
                show_in_filter,
                unit_text,
            });

            const newAttrGroup = await group.save().then(async (res) => {
                if (attribute && attribute.length > 0) {
                    const attrArray = attribute.map((item) => {
                        item.attribute_group = res._id;
                        return item;
                    });
                    const resAttr = await this.createAttributes(attrArray, next);
                    const attrIdArray = resAttr.map((item) => item._id);
                    const responseWithAttribute = await AttributeGroup.findByIdAndUpdate(res._id, {
                        $push: { attribute: { $each: attrIdArray } },
                    });
                    return responseWithAttribute;
                } else {
                    return res;
                }
            });

            return res.status(201).json(newAttrGroup);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async updateSingleAttrGroup(req, res, next) {
        try {
            const { itemId } = req.params;
            const { name_user, name_admin, product_category, unit_text, show_in_filter, attribute } = req.body;
            const updatedAttrGroup = await AttributeGroup.findByIdAndUpdate(
                itemId,
                {
                    name_user,
                    name_admin,
                    slug: slugify(name_admin.toLowerCase()),
                    product_category,
                    unit_text,
                    show_in_filter,
                },
                { new: true }
            )
                .then(async (attrgroup) => {
                    if (attribute.length > 0) {
                        const requests = attribute.map(
                            async ({ _id, value }) => await this.updateSingleAttribute(_id, value, itemId, next)
                        );
                        await Promise.all(requests).then((responses) => {
                            attrgroup.attribute = responses;
                        });
                    }
                    return attrgroup;
                })
                .catch((error) => next(ApiError.internal(error.message)));

            return res.status(200).json(updatedAttrGroup);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async deleteAttribute(req, res, next) {
        try {
            const newAttrGroup = await this.deleteSingleAttribute(req, res, next);
            return res.status(200).json(newAttrGroup);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async deleteAttributeGroup(req, res, next) {
        try {
            const { itemId } = req.params;
            await AttributeGroup.findByIdAndDelete(itemId)
                .then(async (res) => {
                    await Attribute.deleteMany({ attribute_group: itemId }).catch((error) => {
                        next(ApiError.internal(error.message));
                    });
                })
                .catch((error) => {
                    next(ApiError.internal(error.message));
                });
            return res.status(200).json({ message: 'item deleted' });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
}
module.exports = new AttributeGroupController();
