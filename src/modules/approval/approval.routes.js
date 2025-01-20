const { Router } = require('express')
const router = Router()
const { auth } = require('../../controller/auth.controller')
const {
  getAllApproval,
  getDetail,
  updateApproval,
} = require('./approval.controller')
const { actionRequest } = require('./approval.middleware')

router.use(auth)
router.get('/', getAllApproval)
router.get('/:id', getDetail)
router.patch('/:id', actionRequest, updateApproval)

module.exports = router
