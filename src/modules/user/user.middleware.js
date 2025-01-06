const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')
const { Models } = require('../../sequelize/models')
const { check, param } = require('express-validator')
const { User } = Models
const { Op } = require('sequelize')

const checkValidate = async (value, { req }) => {
  const body = req.body
  const { id } = req.params

  const where = {
    email: { [Op.iLike]: body.email },
  }

  if (id) where.id = { [Op.ne]: id }
  const dataExist = await User.findOne({
    where,
    paranoid: false,
  })

  if (dataExist) {
    if (dataExist.isSoftDeleted()) throw 'Data already in archived'
    throw 'Data already exist'
  }

  // if (req.user.role !== 'Administrator' && body.password) {
  //   throw 'Only Administrator can change password'
  // }
}

exports.findOneData = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await User.findOne({
      where: {
        id,
      },
    })

    req.findData = data
    next()
  } catch (error) {
    console.log(error)
    Request.notFound(res, error)
  }
}

exports.storeRequest = [
  check('email').notEmpty().bail().isEmail().bail().custom(checkValidate),
  check('name').notEmpty().bail().isString(),
  check('password').notEmpty().bail().isString(),
  check('role').notEmpty().bail().isString(),
  validateRequest,
  removeUndefinedRequest,
]

exports.updateRequest = [
  check('email').notEmpty().bail().isEmail().bail().custom(checkValidate),
  check('name').notEmpty().bail().isString(),
  // check('password').optional().bail().isString(),
  check('password')
    .optional()
    .bail()
    .isString()
    .bail()
    .custom((value, { req }) => {
      if (req.user.role !== 'Administrator') {
        throw new Error('Only Administrator can change password')
      }
      return true
    }),
  check('role').notEmpty().bail().isString(),
  validateRequest,
  removeUndefinedRequest,
]
