const Router = require('express').Router;
const router = new Router();
const userController = require('../controller/auth');

const { validateSignUpRequest, validateSignInRequest, isReqestValidated } = require('../validators/auth');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);

// router.post('/signup', validateSignUpRequest, isReqestValidated, signup);
// router.post('/signin', validateSignInRequest, isReqestValidated, signin);

/* router.post('/profile', requireSigin, (req, res) => {
  res.status(200).json({ user: 'profile' });
}); */

module.exports = router;
