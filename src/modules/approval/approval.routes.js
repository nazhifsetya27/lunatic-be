const { Router } = require('express')
const router = Router()
const { auth } = require('../../controller/auth.controller')
const { getAllApproval, getDetail } = require('./approval.controller')

router.use(auth)
router.get('/', getAllApproval)
router.get('/:id', getDetail)

module.exports = router
