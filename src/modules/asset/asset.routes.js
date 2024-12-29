const express = require('express')
const { auth } = require('../../controller/auth.controller')

const router = express.Router()
router.use(auth)
router.use('/furniture', require('./furniture/furniture.routes'))
router.use('/elektronik', require('./elektronik/elektronik.routes'))
router.use('/umum', require('./umum/umum.routes'))
router.use('/asset-option', require('./asset-option/asset.option.routes'))

module.exports = router
