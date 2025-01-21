const { Router } = require('express')
const router = Router()
const { auth } = require('../../controller/auth.controller')
const { getDashboard } = require('./dashboard.controller')

// router.use(auth)
router.get('/', getDashboard)

module.exports = router
