const { Router } = require('express')
const { index } = require('./kondisi.controller')

const router = Router()

router.get('/', index)

module.exports = router
