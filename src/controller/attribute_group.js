const AttributeGroup = require('../models/attribute_group');
const Attribute = require('../models/attribute');
const AttributeController = require('../controller/attribute');
const ApiError = require('../error/errorHandler');
const slugify = require('slugify');
const queryString = require('query-string');

class AttributeGroupController extends AttributeController {
    constructor() {
        super();
        this.createSingleAttributeGroup = this.createSingleAttributeGroup.bind(this);
        this.updateSingleAttrGroup = this.updateSingleAttrGroup.bind(this);
    }
    async getAllAttributeGroup(req, res, next) {
        try {
            let { page } = req.params;
            let { limit, search, ...rest } = req.query;
            let arrOfUrlObj = [];
            for (const key in rest) {
                const element = rest[key];
                const obj = {};
                obj[key] = element.split(',');
                arrOfUrlObj.push(obj);
            }
            page = Number(page) || 1;
            limit = Number(limit) || 20;
            let findRequest = {};
            if (search) {
                findRequest = {
                    $and: [{ $text: { $search: search } }, ...arrOfUrlObj],
                };
            } else if (!search && arrOfUrlObj.length > 0) {
                findRequest = {
                    $and: arrOfUrlObj,
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
                .populate({ path: 'category', select: 'name' })
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
            const singleItem = await AttributeGroup.findById(itemId, { __v: 0 }).populate('attribute').exec();
            return res.status(200).json(singleItem);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async createSingleAttributeGroup(req, res, next) {
        try {
            const { name_user, name_admin, category, unit_text, show_in_filter, attribute } = req.body;
            const group = new AttributeGroup({
                name_user,
                name_admin,
                slug: slugify(name_admin, {
                    lower: true,
                    remove: /[*+~()'"!:@]/g,
                }),
                category,
                show_in_filter,
                unit_text,
            });

            const newAttrGroup = await group.save().then(async (res) => {
                if (attribute && attribute.length > 0) {
                    const attrArray = attribute.map((item) => {
                        item.slug = slugify(item.value, {
                            lower: true,
                            remove: /[*+~()'"!:@]/g,
                        });
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
            const { name_user, name_admin, slug, category, unit_text, show_in_filter, attribute } = req.body;
            const arrayOfAttributeIds = attribute.map((item) => item._id);
            const prevData = await AttributeGroup.findById(itemId, { attribute: 1 });
            const updatedAttrGroup = await AttributeGroup.findByIdAndUpdate(
                itemId,
                {
                    name_user,
                    name_admin,
                    slug: slug,
                    category: category || null,
                    unit_text,
                    show_in_filter,
                },
                { new: true }
            )
                .then(async (attrgroup) => {
                    let shouldDeletedAttr = [];
                    if (prevData.attribute.length > 0 && attribute.length === 0) {
                        shouldDeletedAttr = prevData.attribute;
                    }
                    if (prevData.attribute.length > 0 && attribute.length > 0) {
                        shouldDeletedAttr = prevData.attribute.filter(
                            (item) => !arrayOfAttributeIds.includes(String(item))
                        );
                    }
                    if (shouldDeletedAttr.length > 0) {
                        const deletedRequests = shouldDeletedAttr.map(async (_id) => {
                            await this.deleteSingleAttribute(_id, next);
                        });
                        await Promise.all(deletedRequests);
                    }

                    if (attribute.length > 0) {
                        const requests = attribute.map(
                            async ({ _id, value, slug }) =>
                                await this.updateSingleAttribute({ _id, value, slug, attrGroup: itemId, next })
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
