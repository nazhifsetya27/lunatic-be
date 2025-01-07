const { Router } = require('express')
const { storeRequest, updateRequest } = require('./building.middleware')
const {
  getAllBuilding,
  store,
  update,
  show,
  remove,
  restore,
} = require('./building.controller')

const router = Router()

router.get('/', getAllBuilding)
router.get('/:id', show)

router.post('/', storeRequest, store)
router.patch('/:id', updateRequest, update)
router.patch('/:id/restore', restore)

router.delete('/:id', remove)

module.exports = router
