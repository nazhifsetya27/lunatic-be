const { check } = require('express-validator')
const { Op } = require('sequelize')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')
const { Models } = require('../../sequelize/models')

const { StockAdjustment } = Models

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
  check('status')
    .notEmpty()
    .withMessage('Status is required')
    .bail()
    .isString()
    .withMessage('Status must be a string')
    .bail()
    .isIn(['On progress', 'Waiting for approval', 'Approved', 'Rejected'])
    .withMessage('Invalid status'),
  validateRequest,
  removeUndefinedRequest,
]
