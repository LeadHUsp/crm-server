const { model, Schema } = require('mongoose');

const attributeSchema = new Schema({
    value: {
        type: String,
        required: true,
        trim: true,
    },
    slug: { type: String, required: true, unique: true },
    attribute_group: {
        type: Schema.Types.ObjectId,
        ref: 'Attribute_group',
    },
});
attributeSchema.index({ value: 'text' });
module.exports = model('Attribute', attributeSchema);
