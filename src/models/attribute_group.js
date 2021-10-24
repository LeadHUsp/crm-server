const { model, Schema } = require('mongoose');

const attributeGroupSchema = new Schema(
    {
        name_user: {
            type: String,
            required: true,
            trim: true,
        },
        name_admin: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        show_in_filter: {
            type: Boolean,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        unit_text: { type: String },
        product_category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        attribute: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Attribute',
            },
        ],
    },
    { timestamps: true }
);
attributeGroupSchema.index({ name_admin: 'text' });
module.exports = model('Attribute_group', attributeGroupSchema);
