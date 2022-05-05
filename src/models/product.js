const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const productSchema = new Schema(
    {
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
        price: {
            type: Number,
            required: true,
            trim: true,
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
        size_box: {
            type: String,
            required: true,
            trim: true,
        },
        weight_box: {
            type: String,
            required: true,
            trim: true,
        },
        attribute: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Attribute',
            },
        ],
        group: {
            type: Schema.Types.ObjectId,
            ref: 'ProductGroup',
        },
    },
    { timestamps: true }
);

module.exports = model('Product', productSchema);
