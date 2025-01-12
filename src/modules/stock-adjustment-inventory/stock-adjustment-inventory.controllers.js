const { Request } = require('../../helper')
const {
  collections,
  storeData,
  removeData,
  restoreData,
  showData,
  detailData,
  updateData,
  example,
  adjustData,
} = require('./stock-adjustment-inventory.repository')

exports.index = async (req, res) => {
  try {
    Request.success(res, await collections(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.store = async (req, res) => {
  try {
    Request.success(res, await storeData(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.adjust = async (req, res) => {
  try {
    Request.success(res, await adjustData(req))
  } catch (error) {
    Request.error(res, error)
  }
}
