const ApiError = require('../error/errorHandler');

class CrudController {
    async updateOnetoManyRelation(
        modelChildren,
        modelParent,
        itemId,
        body,
        parent_id,
        child_property,
        parent_property,
        res,
        next
    ) {
        try {
            const existingCategory = await modelChildren.findById(itemId).exec();
            if (String(existingCategory[child_property]) !== parent_id) {
                const updatedCategoryItem = await modelChildren
                    .findByIdAndUpdate(
                        itemId,
                        {
                            ...body,
                        },
                        { new: true }
                    )
                    .then(async (res) => {
                        if (parent_id !== null) {
                            await modelParent
                                .findByIdAndUpdate(parent_id, { $push: { [parent_property]: itemId } })
                                .catch((error) => ApiError.internal(error.message));
                        }
                        if (existingCategory[child_property] !== null) {
                            await modelParent
                                .findByIdAndUpdate(existingCategory[child_property], {
                                    $pull: { [parent_property]: { $in: [itemId] } },
                                })
                                .catch((error) => ApiError.internal(error.message));
                        }
                        return res;
                    })
                    .catch((error) => {
                        console.log(error);
                        ApiError.internal(error.message);
                    });

                return res.status(200).json(updatedCategoryItem);
            } else {
                const updatedCategoryItem = await modelChildren
                    .findByIdAndUpdate(
                        itemId,
                        {
                            ...body,
                        },
                        { new: true }
                    )
                    .exec();

                return res.status(200).json(updatedCategoryItem);
            }
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
}
module.exports = CrudController;
