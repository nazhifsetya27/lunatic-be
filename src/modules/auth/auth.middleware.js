const { check } = require('express-validator')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')

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
