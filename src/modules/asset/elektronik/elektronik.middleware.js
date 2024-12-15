const { check, param } = require('express-validator')
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
      const existingData = await Models.Asset.findOne({
        where: {
          category: 'Elektronik',
          name: { [Op.like]: value },
        },
      })

      if (existingData) throw 'nama sudah ada!'
    }),
  check('kode').notEmpty().bail().isString(),
  check('room_id').optional().bail().isUUID(4),
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
      const existingData = await Models.Asset.findOne({
        where: {
          category: 'Elektronik',
          name: { [Op.like]: value },
        },
      })

      if (existingData) throw 'nama sudah ada!'
    }),
  check('kode').optional().bail().isString(),
  check('room_id').optional().bail().isUUID(4),
  validateRequest,
  removeUndefinedRequest,
]
