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
  validateRequest,
  removeUndefinedRequest,
]
