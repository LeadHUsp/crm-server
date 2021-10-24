const { check, validationResult } = require('express-validator');
exports.validateSignUpRequest = [
  check('firstName').notEmpty().withMessage('first name is required'),
  check('lastName').notEmpty().withMessage('last name is required'),
  check('email').isEmail().withMessage('valid email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 symbols long'),
];
exports.validateSignInRequest = [
  check('email').isEmail().withMessage('valid email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 symbols long'),
];

exports.isReqestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({
      errors: errors.array()[0].msg,
    });
  }
  next();
};
