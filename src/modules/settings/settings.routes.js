const express = require('express')
const { auth } = require('../../controller/auth.controller')

const router = express.Router()
router.use(auth)
router.use('/condition', require('./kondisi/kondisi.routes'))
router.use('/storage', require('./storage/storage.routes'))
router.use('/unit', require('./unit/unit.routes'))

module.exports = router
