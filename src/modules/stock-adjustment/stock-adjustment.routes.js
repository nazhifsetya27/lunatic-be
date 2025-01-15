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
} = require('./stock-adjustment.controllers')
const {
  storeRequest,
  updateRequest,
  convertExcel,
} = require('./stock-adjustment.middlewares')
const { auth } = require('../../controller/auth.controller')

const router = express.Router()

router.use(auth)
router.get('/', index)
router.get('/:id/detail', detail)
router.get('/:id/detail-stock-adjustment-result', detailSAResult)

router.post('/', storeRequest, store)

// router.patch('/:id', updateRequest, update)
// router.patch('/:id/restore', restore)

// router.delete('/:id', remove)
// router.post("/import", convertExcel, importData);

module.exports = router
