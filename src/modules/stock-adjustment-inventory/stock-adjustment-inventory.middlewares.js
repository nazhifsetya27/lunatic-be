const { check, param } = require('express-validator')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')
const { Models } = require('../../sequelize/models')
const { checkFile } = require('../../helper/file')

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

exports.adjustRequest = [
  param('stock_adjustment_inventory_id')
    .notEmpty()
    .withMessage('stock_adjustment_inventory_id is required')
    .bail()
    .isUUID(4)
    .withMessage('stock_adjustment_inventory_id must be a valid UUID v4')
    .bail()
    .custom(async (value, { req }) => {
      const stockAdjustmentInventory = await StockAdjustmentInventory.findOne({
        where: {
          id: value,
        },
      })
      if (!stockAdjustmentInventory) {
        throw new Error('stock_adjustment_inventory_id does not exist')
      }
    }),
  check('current_condition_id')
    .notEmpty()
    .withMessage('current_condition_id is required')
    .bail()
    .isUUID(4)
    .withMessage('current_condition_id must be a valid UUID v4')
    .bail()
    .custom(async (value, { req }) => {
      const currentCondition = await Condition.findOne({
        where: {
          id: value,
        },
      })
      if (!currentCondition) {
        throw new Error('current_condition_id does not exist')
      }
    }),
  checkFile({
    name: 'photo',
    required: false,
    allow: ['png', 'jpeg', 'jpg'],
  }),
  validateRequest,
  removeUndefinedRequest,
]
