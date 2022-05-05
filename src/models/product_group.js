const { model, Schema } = require('mongoose');

const productGroupSchema = new Schema(
    {
        description: {
            type: String,
            trim: true,
        },
        attribute: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Attribute',
            },
        ],
        is_single: {
            type: Boolean,
            required: true,
        },
        options: [
            {
                name: {
                    type: Schema.Types.ObjectId,
                    ref: 'Attribute_group',
                },
                template: {
                    type: String,
                    enum: ['color', 'text'],
                    required: true,
                },
                values: [
                    {
                        name: {
                            type: Schema.Types.ObjectId,
                            ref: 'Attribute',
                        },
                        product: {
                            type: Schema.Types.ObjectId,
                            ref: 'Product',
                        },
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

module.exports = model('ProductGroup', productGroupSchema);
