const { Request } = require('../../../helper')
const { Models } = require('../../../sequelize/models')
const { collections, storeData } = require('./furniture.repository')

exports.index = async (req, res) => {
  try {
    Request.success(res, await collections(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.store = async (req, res) => {
  try {
    await storeData(req)
    Request.success(res, { message: 'Data successfully added' })
  } catch (error) {
    Request.error(res, error)
  }
}
