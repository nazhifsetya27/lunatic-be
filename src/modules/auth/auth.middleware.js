const { check } = require('express-validator')
const bcrypt = require('bcryptjs')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')
const { Models } = require('../../sequelize/models')
const { checkFile } = require('../../helper/file')

const checkValidate = async (value, { req }) => {
  const post = req.body
  const user = await Models.User.findByPk(req.user.id, {
    attributes: ['id', 'email', 'password', 'login_access', 'time_zone'],
  })
  const verify = bcrypt.compareSync(post.old_password, user.password)
  if (!verify) {
    throw 'Old password is incorrect'
  }

  req.body.password = req.body.new_password
}

exports.loginValidator = [
  check('email').notEmpty().isEmail(),
  check('password').notEmpty().isString(),
  validateRequest,
  removeUndefinedRequest,
]
exports.updateValidator = [
  check('name').notEmpty().isString().bail().isLength({ max: 60 }),
  check('username').notEmpty().isString().bail().isLength({ max: 60 }),
  check('email').notEmpty().isEmail().bail().isLength({ max: 60 }),
  check('whatsapp').notEmpty().isString().bail().isLength({ max: 17 }),
  checkFile({
    name: 'photo',
    required: false,
    allow: ['png', 'jpeg', 'jpg'],
  }),
  check('delete_photo')
    .optional({ values: 'falsy' })
    .bail()
    .isBoolean()
    .toBoolean(),
  validateRequest,
  removeUndefinedRequest,
]

exports.updateValidator = [
  check('name').notEmpty().isString().bail().isLength({ max: 60 }),
  check('email').notEmpty().isEmail().bail().isLength({ max: 60 }),
  checkFile({
    name: 'photo',
    required: false,
    allow: ['png', 'jpeg', 'jpg'],
  }),
  check('delete_photo')
    .optional({ values: 'falsy' })
    .bail()
    .isBoolean()
    .toBoolean(),
  validateRequest,
  removeUndefinedRequest,
]

exports.changePasswordValidator = [
  check('old_password')
    .notEmpty()
    .isString()
    .bail()
    .isLength({ min: 8 })
    .custom(checkValidate),
  check('new_password').notEmpty().isString().bail().isLength({ min: 8 }),
  validateRequest,
  removeUndefinedRequest,
]
