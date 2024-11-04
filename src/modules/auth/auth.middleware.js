const { check } = require('express-validator')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')

exports.loginValidator = [
  check('email').notEmpty().isEmail(),
  check('password').notEmpty().isString(),
  validateRequest,
  removeUndefinedRequest,
]
