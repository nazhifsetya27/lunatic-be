const express = require('express')
const {
  index,
  store,
  remove,
  restore,
  detail,
  show,
  update,
  printCode,
  imports,
  example,
} = require('./furniture.controller')
const {
  storeRequest,
  updateRequest,
  importRequest,
} = require('./furniture.middleware')

const router = express.Router()

router.get('/', index)
router.get('/example', example)
router.get('/:id', show)
router.get('/:id/detail', detail)
router.get('/:id/print', printCode)

router.post('/', storeRequest, store)

router.post('/import', importRequest, imports)
router.patch('/:id', updateRequest, update)
router.patch('/:id/restore', restore)

router.delete('/:id', remove)

module.exports = router
