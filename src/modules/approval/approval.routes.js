const { Router } = require('express')
const router = Router()
const { auth } = require('../../controller/auth.controller')
const { getAllApproval } = require('./approval.controller')

router.use(auth)
router.get('/', getAllApproval)

module.exports = router
