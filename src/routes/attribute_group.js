const express = require('express');

const { requireSigin, adminMiddleware } = require('../common-middleware');
const AttrGroupValidator = require('../validators/attributeGroupValidator');
const AttributeGroupController = require('../controller/attribute_group');

const router = express.Router();

router.get(['/attribute-group', '/attribute-group/category/:itemId'], AttributeGroupController.getAllAttributeGroup);
router.get('/attribute-group/:itemId', AttributeGroupController.getSingleAttributeGroup);
router.post(
    '/attribute-group/',
    AttrGroupValidator.createItemValidator,
    AttributeGroupController.createSingleAttributeGroup
);
router.put(
    '/attribute-group/:itemId',
    AttrGroupValidator.updateItemValidator,
    AttributeGroupController.updateSingleAttrGroup
);
router.put('/attribute-group/update-attribute/:itemId', AttributeGroupController.updateSingleAttribute);
router.delete('/attribute/:itemId', AttributeGroupController.deleteAttribute);
router.delete('/attribute-group/:itemId', AttributeGroupController.deleteAttributeGroup);

module.exports = router;
