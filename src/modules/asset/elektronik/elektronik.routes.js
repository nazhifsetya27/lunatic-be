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
} = require('./elektronik.controller')
const { storeRequest, updateRequest, convertExcel } = require('./elektronik.middleware')

const router = express.Router()

router.get('/', index)
router.get("/example", example);
router.get('/:id', show)
router.get('/:id/detail', detail)
router.post('/', storeRequest, store)

router.patch('/:id', updateRequest, update)
router.patch('/:id/restore', restore)

router.delete('/:id', remove)
router.post("/import", convertExcel, importData);

module.exports = router
