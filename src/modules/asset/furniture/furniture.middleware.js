const { check, param } = require('express-validator')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../../helper/request.validator')

exports.storeRequest = [
  check('name').notEmpty().bail().isString(),
  check('kode').notEmpty().bail().isString(),
  check('room_id').optional().bail().isUUID(4),
  validateRequest,
  removeUndefinedRequest,
]
