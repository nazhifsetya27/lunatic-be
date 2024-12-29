const express = require('express')
const {
  buildingList,
  unitList,
  floorList,
  roomList,
} = require('./asset.option.controller')

const router = express.Router()

router.get('/unit-list', unitList)
router.get('/building-list', buildingList)
router.get('/floor-list', floorList)
router.get('/room-list', roomList)

module.exports = router
