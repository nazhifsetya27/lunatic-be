const fs = require('fs')
const path = require('path')
const { Request } = require('../../helper')
const { Models } = require('../../sequelize/models')
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
  storeFromScanData,
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

exports.storeFromScan = async (req, res) => {
  try {
    Request.success(res, await storeFromScanData(req))
  } catch (error) {
    Request.error(res, error)
  }
}

// eslint-disable-next-line consistent-return
exports.viewFile = async (req, res) => {
  try {
    const { image_id } = req.params
    const STOCK_ADJUSTMENT_FILE_PATH = path.join(
      'public',
      'uploads',
      'images',
      'stock_adjustment'
    )

    const evidence_ids = image_id.split('_')
    // console.log(evidence_ids)

    const stockAdjustment = await Models.StockAdjustment.findOne({
      paranoid: false,
      attributes: ['id'],
      where: { id: evidence_ids[0] },
    })
    // console.log(stockAdjustment)

    const furniture = evidence_ids[1] === 'furniture'
    const umum = evidence_ids[1] === 'umum'
    const elektronik = evidence_ids[1] === 'elektronik'

    const furniturePath = path.join(STOCK_ADJUSTMENT_FILE_PATH, 'part-number')

    const fileName = fs
      .readdirSync(STOCK_ADJUSTMENT_FILE_PATH)
      .find((item) => item.startsWith(image_id))

    if (!stockAdjustment || !fileName)
      return res
        .status(404)
        .json({ statusCode: 404, message: 'File not found' })

    return res.sendFile(path.resolve(STOCK_ADJUSTMENT_FILE_PATH, fileName))
  } catch (error) {
    return res
      .status(500)
      .json({ error: error?.message ?? 'Something went wrong' })
  }
}
