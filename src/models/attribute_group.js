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
            index: true,
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
        category: {
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

module.exports = model('Attribute_group', attributeGroupSchema.index({ name_admin: 'text' }));
