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

  const existingEmailUser = await User.findOne({
    where: {
      email: { [Op.iLike]: body.email },
      ...(id && { id: { [Op.ne]: id } }),
    },
    paranoid: false,
  })

  if (existingEmailUser) {
    throw 'A user with this email already exists.'
  }

  if (['Administrator', 'Approver'].includes(body.role)) {
    const existingRoleUser = await User.findOne({
      where: {
        role: body.role,
        unit_id: body.unit_id,
        ...(id && { id: { [Op.ne]: id } }),
      },
      paranoid: false,
    })

    if (existingRoleUser) {
      throw `A user with the role ${body.role} already exists in this unit.`
    }
  }
}

exports.findOneData = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await User.findOne({
      where: {
        id,
      },
      paranoid: false,
      include: [
        {
          association: 'unit',
          attributes: ['id', 'name'],
        },
      ],
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
  check('unit_id').notEmpty().bail().isString(),
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
  check('unit_id').notEmpty().bail().isString().isUUID(),
  validateRequest,
  removeUndefinedRequest,
]
