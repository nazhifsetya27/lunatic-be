const { Request } = require('../../../../helper')
const { collections } = require('./building.repository')

exports.getAllBuilding = async (req, res) => {
  try {
    Request.success(res, await collections(req))
  } catch (error) {
    Request.error(res, error)
  }
}
