const express = require('express')
const {
  index,
  store,
  restore,
  remove,
  detail,
  show,
  update,
} = require('./umum.controller')
const { storeRequest, updateRequest } = require('./umum.middleware')

const router = express.Router()

router.get('/', index)
router.get('/:id', show)
router.get('/:id/detail', detail)

router.post('/', storeRequest, store)

router.patch('/:id', updateRequest, update)
router.patch('/:id/restore', restore)

router.delete('/:id', remove)

module.exports = router
