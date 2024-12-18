const { Router } = require('express')
const { getAllRoom } = require('./room.controller')

const router = Router()

router.get('/', getAllRoom)

module.exports = router
