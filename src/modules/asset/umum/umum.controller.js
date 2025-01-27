const { Request } = require('../../../helper')
const { Models } = require('../../../sequelize/models')
const {
  collections,
  storeData,
  removeData,
  restoreData,
  detailData,
  showData,
  updateData,
  printData,
  exampleData,
  importData,
} = require('./umum.repository')

exports.index = async (req, res) => {
  try {
    Request.success(res, await collections(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.example = async (req, res) => {
  try {
    await exampleData(req, res)
  } catch (error) {
    Request.error(res, error)
  }
}

exports.show = async (req, res) => {
  try {
    Request.success(res, await showData(req))
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

exports.store = async (req, res) => {
  try {
    await storeData(req)
    Request.success(res, { message: 'Data successfully added' })
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

exports.restore = async (req, res) => {
  try {
    await restoreData(req)
    Request.success(res, { message: 'Data successfully restored' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.update = async (req, res) => {
  try {
    await updateData(req)
    Request.success(res, { message: 'Data successfully updated' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.printCode = async (req, res) => {
  try {
    Request.success(res, await printData(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.imports = async (req, res) => {
  try {
    const data = await importData(req)
    Request.success(res, { message: 'Success import data', data })
  } catch (error) {
    Request.error(res, error)
  }
}
