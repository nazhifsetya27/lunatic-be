const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../helper/request.validator')
const { Models } = require('../../sequelize/models')
const { check, param } = require('express-validator')
const { Approval } = Models
const { Op } = require('sequelize')

exports.actionRequest = [
  check('status') // Cancel ticket, Change ticket, Reschedule, Report
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .isIn(['Rejected', 'Approved']),
  check('description')
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .isLength({ max: 255 }),
  validateRequest,
  removeUndefinedRequest,
]
