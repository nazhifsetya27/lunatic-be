const express = require('express')

const {
  unitList,
  buildingList,
  floorList,
  roomList,
} = require('./option.respositories')

const router = express.Router()

router.get('/unit-list', unitList)
router.get('/building-list', buildingList)
router.get('/floor-list', floorList)
router.get('/room-list', roomList)

module.exports = router
