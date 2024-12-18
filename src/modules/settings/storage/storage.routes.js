const express = require('express')
const { auth } = require('../../../controller/auth.controller')

const router = express.Router()
router.use(auth)
router.use('/building', require('./building/building.routes'))
router.use('/floor', require('./floor/floor.routes'))
router.use('/room', require('./room/room.routes'))

module.exports = router
