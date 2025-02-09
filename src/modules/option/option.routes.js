const express = require('express')

const {
  unitList,
  buildingList,
  floorList,
  roomList,
  conditionList,
  assetList,
  kodeList,
  approverList,
  requesterList,
} = require('./option.respositories')
const { auth } = require('../../controller/auth.controller')

const router = express.Router()

router.use(auth)
router.get('/unit-list', unitList)
router.get('/building-list', buildingList)
router.get('/floor-list', floorList)
router.get('/room-list', roomList)
router.get('/condition-list', conditionList)
router.get('/asset-list', assetList)
router.get('/kode-list', kodeList)
router.get('/approver-list', approverList)
router.get('/requester-list', requesterList)

module.exports = router
