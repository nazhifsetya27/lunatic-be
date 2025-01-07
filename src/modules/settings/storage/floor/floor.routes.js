const { Router } = require('express')
const { storeRequest, updateRequest } = require('./floor.middleware')
const {
  getAllFloor,
  store,
  update,
  show,
  remove,
  restore,
} = require('./floor.controller')

const router = Router()

router.get('/', getAllFloor)
router.get('/:id', show)

router.post('/', storeRequest, store)
router.patch('/:id', updateRequest, update)
router.patch('/:id/restore', restore)

router.delete('/:id', remove)

module.exports = router
