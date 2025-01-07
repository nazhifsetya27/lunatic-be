const { Router } = require('express')
const {
  getAllRoom,
  store,
  update,
  show,
  remove,
  restore,
} = require('./room.controller')
const { storeRequest, updateRequest } = require('./room.middleware')

const router = Router()

router.get('/', getAllRoom)
router.get('/:id', show)

router.post('/', storeRequest, store)
router.patch('/:id', updateRequest, update)
router.patch('/:id/restore', restore)

router.delete('/:id', remove)

module.exports = router
