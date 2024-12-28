const { Router } = require('express')
const { loginValidator } = require('./building.middleware')
const { getAllBuilding } = require('./building.controller')

const router = Router()

router.get('/', getAllBuilding)

module.exports = router
