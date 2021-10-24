const express = require('express');
const { signup, signout, signin, verifyToken } = require('../../controller/admin/auth');
const { validateSignUpRequest, validateSignInRequest, isReqestValidated } = require('../../validators/auth');
const { requireSigin } = require('../../common-middleware/index');
const router = express.Router();

router.post('/admin/signup', validateSignUpRequest, isReqestValidated, signup);
router.post('/admin/signin', validateSignInRequest, isReqestValidated, signin);
router.get('/admin/verify', verifyToken);
router.post('/admin/signout', requireSigin, signout);

module.exports = router;
