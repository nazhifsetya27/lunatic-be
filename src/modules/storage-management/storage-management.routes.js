const express = require('express')
const {
  index,
  store,
  remove,
  restore,
  show,
  detail,
  update,
} = require('./storage-management.controller')
const {
  storeRequest,
  updateRequest,
} = require('./storage-management.middlewares')
const { auth } = require('../../controller/auth.controller')

const router = express.Router()

router.use(auth)
router.get('/:unit_id', index)
router.get('/:unit_id/:building_id', show)
// router.get('/:id/detail', detail)

router.post('/', storeRequest, store)

// router.patch('/:id', updateRequest, update)
// router.patch('/:id/restore', restore)

router.delete('/:id', remove)

module.exports = router
