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
  detailSAResultData,
} = require('./stock-adjustment.repositories')

exports.index = async (req, res) => {
  try {
    Request.success(res, await collections(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.detail = async (req, res) => {
  try {
    Request.success(res, await detailData(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.detailSAResult = async (req, res) => {
  try {
    Request.success(res, await detailSAResultData(req))
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
