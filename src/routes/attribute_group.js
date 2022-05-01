const express = require('express');

const { requireSigin, adminMiddleware } = require('../common-middleware');
const AttrGroupValidator = require('../validators/attributeGroupValidator');
const AttributeGroupController = require('../controller/attribute_group');

const router = express.Router();
router.get('/attribute-group/', AttributeGroupController.getAllAttributeGroup);
router.get('/attribute-group/page=:page?', AttributeGroupController.getAllAttributeGroup);
router.get('/attribute-group/:itemId', AttributeGroupController.getSingleAttributeGroup);
router.post(
    '/attribute-group/',
    requireSigin,
    adminMiddleware,
    AttrGroupValidator.createItemValidator,
    AttributeGroupController.createSingleAttributeGroup
);
router.put(
    '/attribute-group/:itemId',
    requireSigin,
    adminMiddleware,
    AttrGroupValidator.updateItemValidator,
    AttributeGroupController.updateSingleAttrGroup
);
router.delete('/attribute-group/:itemId', AttributeGroupController.deleteAttributeGroup);

module.exports = router;
