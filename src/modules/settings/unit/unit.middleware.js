const { check } = require('express-validator')
const { Op } = require('sequelize')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../../helper/request.validator')
const { Models } = require('../../../sequelize/models')

exports.storeRequest = [
  check('name')
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .custom(async (value, { req }) => {
      const existingData = await Models.Unit.findOne({
        where: {
          name: { [Op.like]: value },
        },
      })

      if (existingData) throw 'Name already exist!'
    }),
  check('kode').notEmpty().bail().isString(),
  validateRequest,
  removeUndefinedRequest,
]

exports.updateRequest = [
  check('name')
    .optional()
    .bail()
    .isString()
    .bail()
    .custom(async (value, { req }) => {
      const existingData = await Models.Unit.findOne({
        where: {
          name: { [Op.like]: value },
        },
      })

      if (existingData) throw 'Name already exist!'
    }),
  check('kode').optional().bail().isString(),
  validateRequest,
  removeUndefinedRequest,
]
