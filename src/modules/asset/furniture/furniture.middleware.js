const { check, param } = require('express-validator')
const { Op } = require('sequelize')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../../helper/request.validator')
const { Models } = require('../../../sequelize/models')
const { checkFile, readFileExcel } = require('../../../helper/file')

exports.storeRequest = [
  check('name')
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .custom(async (value, { req }) => {
      const existingData = await Models.Asset.findOne({
        where: {
          category: 'Furniture',
          name: { [Op.like]: value },
        },
      })

      if (existingData) throw 'Name already exist!'
    }),
  check('kode').notEmpty().bail().isString(),
  check('unit_id').notEmpty().bail().isUUID(4),
  check('building_id').notEmpty().bail().isUUID(4),
  check('floor_id').optional().bail().isUUID(4),
  check('room_id').optional().bail().isUUID(4),
  validateRequest,
  removeUndefinedRequest,
]

exports.updateRequest = [
  check('name').notEmpty().bail().isString(),
  check('kode').optional().bail().isString(),
  check('unit_id').optional().bail().isUUID(4),
  check('building_id').optional().bail().isUUID(4),
  check('floor_id').optional().bail().isUUID(4),
  check('room_id').optional().bail().isUUID(4),
  validateRequest,
  removeUndefinedRequest,
]

exports.importRequest = [
  checkFile({
    name: 'furnitures',
    allow: ['vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    multi: false,
    required: true,
  }),
  readFileExcel('furnitures'),
]
