const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
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
        long_description: {
            type: String,
            required: false,
        },
        category_image: { type: Schema.Types.ObjectId, ref: 'Gallery' },
        children: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Category',
                autopopulate: true,
            },
        ],
        parent_id: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
    },
    { timestamps: true }
);

categorySchema.plugin(require('mongoose-autopopulate'));
module.exports = model('Category', categorySchema);
