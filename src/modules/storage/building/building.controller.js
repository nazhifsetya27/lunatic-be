const { Request } = require('../../../helper')
const { collections } = require('./building.repository')

exports.getAllBuilding = async (req, res) => {
  try {
    const data = await collections(req)
    Request.success(res, { message: 'Success', data })
  } catch (error) {
    Request.error(res, error)
  }
}
