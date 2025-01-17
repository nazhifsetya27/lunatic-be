const express = require('express')
const {
  index,
  store,
  remove,
  restore,
  show,
  detail,
  update,
  importData,
  example,
  detailSAResult,
  storeFromScan,
  viewFile
} = require('./stock-adjustment.controllers')
const {
  storeRequest,
  updateRequest,
  convertExcel,
  storeFromScanRequest,
} = require('./stock-adjustment.middlewares')
const { auth } = require('../../controller/auth.controller')

const router = express.Router()

router.get('/:image_id/view', viewFile)
router.use(auth)
router.get('/', index)
router.get('/:id/detail', detail)
router.get('/:id/detail-stock-adjustment-result', detailSAResult)

router.post('/', storeRequest, store)
router.post('/:asset_id', storeFromScanRequest, storeFromScan)

// router.patch('/:id', updateRequest, update)
// router.patch('/:id/restore', restore)

// router.delete('/:id', remove)
// router.post("/import", convertExcel, importData);

module.exports = router
