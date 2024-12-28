const { Router } = require('express')
const { storeRequest, updateRequest } = require('./unit.middleware')
const {
  index,
  store,
  show,
  detail,
  update,
  restore,
  remove,
} = require('./unit.controller')

const router = Router()

router.get('/', index)
router.get('/:id', show)
router.get('/:id/detail', detail)

router.post('/', storeRequest, store)

router.patch('/:id', updateRequest, update)
router.patch('/:id/restore', restore)

router.delete('/:id', remove)

module.exports = router
