'use strict';
const Gallery = require('../models/gallery');
const path = require('path');
const { promisify } = require('util');
const sizeOf = promisify(require('image-size'));
const fs = require('fs');

const ApiError = require('../error/errorHandler');

class galleryController {
    constructor() {
        this.createGalleryItems = this.createGalleryItems.bind(this);
    }
    async saveSingleItemToDisk(file) {
        try {
            const fileName = new Date().toISOString().replace(/:/g, '-') + file.name;
            await file.mv(path.resolve(__dirname, '../../', 'uploads', fileName));
            const dimensions = await sizeOf(`uploads/${fileName}`);
            // console.log(dimensions);
            let filesData = {
                alt: '',
                size: `${Math.round(file.size / 1024)}Kb`,
                name: fileName,
                title: fileName,
                width: dimensions.width,
                height: dimensions.height,
            };
            // console.log(filesData);
            return filesData;
        } catch (error) {
            console.log(error.message);
            // next(ApiError.internal(error.message));
        }
    }

    async createGalleryItems(req, res, next) {
        try {
            const { files } = req.files;
            if (files.length > 0) {
                let savedResult = await Promise.all(
                    files.map(async (item) => {
                        let filesData = await this.saveSingleItemToDisk(item);
                        // console.log(filesData);
                        return filesData;
                    })
                )
                    .then((res) => res)
                    .catch((error) => next(ApiError.internal(error.message)));

                await Gallery.insertMany(savedResult, function (error, result) {
                    if (error) {
                        next(ApiError.internal(error.message));
                    }
                    return res.status(201).json({
                        result,
                    });
                });
            } else {
                let filesData = await this.saveSingleItemToDisk(files);
                const image = new Gallery(filesData);
                image.save((error, image) => {
                    if (error) {
                        next(ApiError.internal(error.message));
                    }
                    if (image) {
                        return res.status(201).json({
                            image,
                        });
                    }
                });
            }
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async getAllGalleryItems(req, res, next) {
        try {
            const totalDocs = await Gallery.countDocuments({});
            let { limit, page } = req.query;
            page = page || 1;
            limit = limit || 12;
            const totalPages = Math.ceil(totalDocs / limit);
            let offset = page * limit - limit;
            const allGalleryItems = await Gallery.find({}, null, {
                skip: offset,
                limit: limit,
                sort: {
                    createdAt: -1,
                },
            }).exec();

            return res
                .header({
                    'Access-Control-Expose-Headers': 'X_TotalPages',
                    X_TotalPages: totalPages,
                })
                .status(200)
                .json({
                    data: allGalleryItems,
                    total_pages: totalPages,
                });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async getSingleGalleryItem(req, res, next) {
        try {
            const { itemId } = req.params;

            const singleGalleryItem = await Gallery.findById(itemId, function (error) {
                if (error) res.status(404).json({ message: 'Not found' });
            }).exec();
            return res.status(200).json(singleGalleryItem);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
    async updateSingleGalleryItem(req, res, next) {
        try {
            const { itemId } = req.params;
            const { title, alt } = req.body;
            const updatedGalleryItem = await Gallery.findByIdAndUpdate(
                itemId,
                {
                    title,
                    alt: alt || '',
                },
                { new: true }
            ).exec();
            return res.status(200).json(updatedGalleryItem);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async deleteGalleryItems(req, res, next) {
        try {
            const ids = Object.keys(req.body);
            await Promise.all(
                Object.values(req.body).map(async (item) => {
                    await fs.promises
                        .unlink(path.resolve(__dirname, '../../', 'uploads', item.name))
                        .then((res) => res)
                        .catch((error) => error);
                })
            ).catch((error) => error);

            await Gallery.deleteMany({ _id: { $in: ids } }).exec();
            return res.status(200).json({
                message: 'Items success deleted',
            });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
}

module.exports = new galleryController();
