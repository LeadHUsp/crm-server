const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },

        description: {
            type: String,
            // required: true,
            trim: true,
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
        options: [
            {
                amount: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                attribute: {
                    type: Schema.Types.ObjectId,
                    ref: 'Attribute',
                },
            },
        ],
        attribute: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Attribute',
            },
        ],
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
    },
    { timestamps: true }
);

module.exports = model('Product', productSchema);
