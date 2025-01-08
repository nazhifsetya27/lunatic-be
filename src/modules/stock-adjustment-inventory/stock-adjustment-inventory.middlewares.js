const { check, param } = require('express-validator')
const { Op } = require('sequelize')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')
const { Models } = require('../../sequelize/models')

const { StockAdjustment, StockAdjustmentInventory, Asset, Condition } = Models

exports.storeRequest = [
  check('stock_adjustment_id')
    .notEmpty()
    .withMessage('stock_adjustment_id is required')
    .bail()
    .isUUID(4)
    .withMessage('stock_adjustment_id must be a valid UUID v4')
    .bail()
    .custom(async (value, { req }) => {
      const stockAdjustment = await StockAdjustment.findOne({
        where: {
          id: value,
        },
      })
      if (!stockAdjustment) {
        throw new Error('stock_adjustment_id does not exist')
      }
    }),
  check('asset_id')
    .notEmpty()
    .withMessage('asset_id is required')
    .bail()
    .isUUID(4)
    .withMessage('asset_id must be a valid UUID v4')
    .bail()
    .custom(async (value, { req }) => {
      const asset = await Asset.findOne({
        where: {
          id: value,
        },
      })
      if (!asset) {
        throw new Error('asset_id does not exist')
      }
    }),
  check('previous_condition_id')
    .notEmpty()
    .withMessage('previous_condition_id is required')
    .bail()
    .isUUID(4)
    .withMessage('previous_condition_id must be a valid UUID v4')
    .bail()
    .custom(async (value, { req }) => {
      const asset = await Condition.findOne({
        where: {
          id: value,
        },
      })
      if (!asset) {
        throw new Error('asset_id does not exist')
      }
    }),
  validateRequest,
  removeUndefinedRequest,
]
