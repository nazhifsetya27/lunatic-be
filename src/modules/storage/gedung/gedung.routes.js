const { Router } = require('express')
const { loginValidator } = require('./gedung.middleware')
const { getAllGedung } = require('./gedung.controller')

const router = Router()

router.get('/', getAllGedung)

module.exports = router
