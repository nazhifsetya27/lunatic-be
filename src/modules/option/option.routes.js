const express = require('express')

const {
  unitList,
  buildingList,
  floorList,
  roomList,
  conditionList,
  assetList
} = require('./option.respositories')

const router = express.Router()

router.get('/unit-list', unitList)
router.get('/building-list', buildingList)
router.get('/floor-list', floorList)
router.get('/room-list', roomList)
router.get('/condition-list', conditionList)
router.get('/asset-list', assetList)

module.exports = router
