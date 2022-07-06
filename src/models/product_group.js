const { model, Schema } = require('mongoose');

const productGroupSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
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
        is_single_product: {
            type: Boolean,
            required: true,
        },
        variants: {
            by_attribure_group: {
                type: Schema.Types.ObjectId,
                ref: 'Attribute_group',
            },
            template: {
                type: String,
                enum: ['color', 'text'],
                default: 'text',
            },
            values: [
                {
                    template_data: {
                        type: String,
                        trim: true,
                    },
                    attribute: {
                        type: Schema.Types.ObjectId,
                        ref: 'Attribute',
                    },
                    name: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                    slug: {
                        type: String,
                        required: true,
                        trim: true,
                        unique: true,
                    },
                    amount: {
                        type: Number,
                        required: true,
                        trim: true,
                    },
                    seo_title: {
                        type: String,
                        required: false,
                    },
                    seo_description: {
                        type: String,
                        required: false,
                    },
                    seo_keywords: {
                        type: String,
                        required: false,
                    },
                    thumb: {
                        type: Schema.Types.ObjectId,
                        ref: 'Gallery',
                    },
                    gallery: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: 'Gallery',
                        },
                    ],
                    vendore_code: {
                        type: String,
                        required: true,
                        trim: true,
                        unique: true,
                    },
                    card_attribute: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: 'Attribute',
                        },
                    ],
                },
            ],
        },
    },
    { timestamps: true }
);

module.exports = model('ProductGroup', productGroupSchema);
