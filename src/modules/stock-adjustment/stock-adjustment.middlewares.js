const { check, param } = require('express-validator')
const { Op } = require('sequelize')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')
const { Models } = require('../../sequelize/models')

const { StockAdjustment, Asset } = Models

exports.storeRequest = [
  check('name')
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .custom(async (value, { req }) => {
      const existingData = await StockAdjustment.findOne({
        where: {
          name: { [Op.like]: value },
        },
      })
      if (existingData) throw 'Name already exist!'
    }),
  validateRequest,
  removeUndefinedRequest,
]

exports.storeFromScanRequest = [
  param('asset_id')
    .notEmpty()
    .bail()
    .isUUID(4)
    .bail()
    .custom(async (value, { req }) => {
      const existingData = await Asset.findOne({
        where: {
          id: value,
        },
        include: [
          {
            paranoid: false,
            association: 'condition',
            attributes: ['id', 'name'],
          },
        ],
      })
      if (!existingData) throw 'Asset not found!'
      req.adjustedAsset = existingData
    }),
  validateRequest,
  removeUndefinedRequest,
]
