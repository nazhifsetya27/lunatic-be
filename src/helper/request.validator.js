const { matchedData, validationResult } = require('express-validator')
const Request = require('./request')

exports.validateRequest = (req, res, next) => {
  const result = validationResult(req)
  if (result.isEmpty()) {
    return next()
  }
  return Request.badRequest(res, { errors: result.array() })
}

exports.removeUndefinedRequest = (req, res, next) => {
  req.body = matchedData(req, {
    locations: ['body'],
    includeOptionals: true,
  })
  next()
}
