const { Request } = require('../../../../helper')
const { collections } = require('./floor.repository')

exports.getAllFloor = async (req, res) => {
  try {
    Request.success(res, await collections(req))
  } catch (error) {
    Request.error(res, error)
  }
}
