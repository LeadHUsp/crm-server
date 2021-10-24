const express = require('express');

const { requireSigin, adminMiddleware } = require('../common-middleware');

const AttributeController = require('../controller/attribute');

const router = express.Router();

// router.get(['/attribute/', '/attribute/by_group/:groupId'], AttributeController.getAllAttribute);
// router.get('/attribute/:itemId', AttributeController.getSingleAttribute);
// router.post('/attribute/', AttributeController.createSingleAttribute);
// router.put('/attribute/:itemId', AttributeController.updateSingleAttribute);
// router.delete('/attribute/:itemId', AttributeController.deleteSingleAttribute);

module.exports = router;
