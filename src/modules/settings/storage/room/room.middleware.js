const { Op } = require('sequelize')
const { check } = require('express-validator')
const {
  validateRequest,
  removeUndefinedRequest,
} = require('../../../../helper/request.validator')
const { Models } = require('../../../../sequelize/models')

exports.storeRequest = [
  check('iccid')
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .custom(async (value) => {
      const data = await Models.SimCard.findOne({
        where: { iccid: { [Op.iLike]: value } },
        paranoid: false,
      })
      if (data) throw new FlowError('ICCID already exists')
    }),
  validateRequest,
  removeUndefinedRequest,
]
