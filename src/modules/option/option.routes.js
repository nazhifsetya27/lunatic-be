const express = require('express')

const {
  unitList,
  buildingList,
  floorList,
  roomList,
  conditionList,
} = require('./option.respositories')

const router = express.Router()

router.get('/unit-list', unitList)
router.get('/building-list', buildingList)
router.get('/floor-list', floorList)
router.get('/room-list', roomList)
router.get('/condition-list', conditionList)

module.exports = router
