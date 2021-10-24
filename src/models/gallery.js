const { model, Schema } = require('mongoose');

const Gallery = new Schema(
    {
        name: {
            type: String,
            default: '',
        },
        alt: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        size: {
            type: String,
            default: 0,
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = model('Gallery', Gallery);
