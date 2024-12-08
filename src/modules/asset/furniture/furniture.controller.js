const { Request } = require('../../../helper')
const { collections } = require('./furniture.repository')

exports.index = async (req, res) => {
  try {
    Request.success(res, await collections(req))
  } catch (error) {
    Request.error(res, error)
  }
}
