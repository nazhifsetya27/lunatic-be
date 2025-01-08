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
} = require('./stock-adjustment-inventory.controllers')
const {
  storeRequest,
  updateRequest,
  convertExcel,
} = require('./stock-adjustment-inventory.middlewares')
const { auth } = require('../../controller/auth.controller')

const router = express.Router()

router.use(auth)
router.get('/:stock_adjustment_id', index)
// router.get("/example", example);
// router.get('/:id', show)
// router.get('/:id/detail', detail)

router.post('/', storeRequest, store)

// router.patch('/:id', updateRequest, update)
// router.patch('/:id/restore', restore)

// router.delete('/:id', remove)
// router.post("/import", convertExcel, importData);

module.exports = router
