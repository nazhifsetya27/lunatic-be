const { Request } = require('../../helper')
const {
  collections,
  storeData,
  removeData,
  restoreData,
  showData,
  detailData,
  updateData,
} = require('./storage-management.repository')

exports.index = async (req, res) => {
  try {
    Request.success(res, await collections(req))
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

// exports.detail = async (req, res) => {
//   try {
//     Request.success(res, await detailData(req))
//   } catch (error) {
//     Request.error(res, error)
//   }
// }

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

// exports.restore = async (req, res) => {
//   try {
//     await restoreData(req)
//     Request.success(res, { message: 'Data successfully restored' })
//   } catch (error) {
//     Request.error(res, error)
//   }
// }

// exports.update = async (req, res) => {
//   try {
//     await updateData(req)
//     Request.success(res, { message: 'Data successfully updated' })
//   } catch (error) {
//     Request.error(res, error)
//   }
// }
