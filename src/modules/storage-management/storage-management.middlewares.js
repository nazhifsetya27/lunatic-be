const { check } = require('express-validator')
const { Op } = require('sequelize')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')
const { Models } = require('../../sequelize/models')

exports.storeRequest = [
  check('unit_id').notEmpty().bail().isUUID(4).bail(),
  check('building_ids').optional().bail().isArray().bail(),
  check('floor_id').optional().bail().isUUID(4).bail(),
  check('room_id').optional().bail().isUUID(4).bail(),

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

      if (existingData) throw 'nama sudah ada!'
    }),
  check('kode').optional().bail().isString(),
  validateRequest,
  removeUndefinedRequest,
]
