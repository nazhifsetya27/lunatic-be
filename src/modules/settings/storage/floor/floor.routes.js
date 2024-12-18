const { Router } = require('express')
const { getAllFloor } = require('./floor.controller')

const router = Router()

router.get('/', getAllFloor)

module.exports = router
