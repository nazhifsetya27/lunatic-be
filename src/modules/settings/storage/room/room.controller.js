const { Request } = require('../../../../helper')
const { collections } = require('./room.repository')

exports.getAllRoom = async (req, res) => {
  try {
    const data = await collections(req)
    Request.success(res, { message: 'Success', data })
  } catch (error) {
    Request.error(res, error)
  }
}
