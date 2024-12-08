const express = require('express')
const { auth } = require('../../controller/auth.controller')


const router = express.Router()
router.use(auth)
router.use('/furniture', require('./furniture/furniture.routes'))
// router.use('/sam-card', require('./sam-card/sam-card.routes'))
// router.use('/peripheral', require('./peripheral/peripheral.routes'))
// router.use('/thermal', require('./thermal/thermal.routes'))
// router.use('/sim-card', require('./sim-card/sim-card.routes'))

module.exports = router
