'use strict';

const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const galleryController = require('../controller/gallery');
const { requireSigin, adminMiddleware } = require('../common-middleware');

router.get('/gallery', galleryController.getAllGalleryItems);
router.get('/gallery/:itemId', galleryController.getSingleGalleryItem);
router.post('/gallery', requireSigin, adminMiddleware, fileUpload({}), galleryController.createGalleryItems);

router.put('/gallery/:itemId', requireSigin, adminMiddleware, galleryController.updateSingleGalleryItem);

router.delete('/gallery', requireSigin, adminMiddleware, galleryController.deleteGalleryItems);

module.exports = router;
