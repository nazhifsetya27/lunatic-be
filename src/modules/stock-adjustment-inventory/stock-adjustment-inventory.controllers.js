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
  submitAdjustment,
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
    await storeData(req)
    Request.success(res, { message: 'Data successfully created' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.adjust = async (req, res) => {
  try {
    await adjustData(req)
    Request.success(res, { message: 'Data successfully adjusted' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.submit = async (req, res) => {
  try {
    await submitAdjustment(req)
    Request.success(res, { message: 'Data successfully submitted' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.remove = async (req, res) => {
  try {
    await removeData(req)
    Request.success(res, { message: 'Data successfully removed' })
  } catch (error) {
    Request.error(res, error)
  }
}
