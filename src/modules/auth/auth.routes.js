const { Router } = require('express')
const {
  loginValidator,
  changePasswordValidator,
  // updateValidator,
  // changePasswordValidator,
} = require('./auth.middleware')
const {
  login,
  getAllUser, /* session, detail, update */
  update,
} = require('./auth.repository')
const { auth } = require('../../controller/auth.controller')

const router = Router()

router.post('/', loginValidator, login)

router.use(auth)
router.get('/', getAllUser)
router.patch('/change-password', changePasswordValidator, update)
// router.use(auth)
// router.get('/session', session)
// router.get('/detail', detail)
// router.patch('/update', updateValidator, update)
// router.patch('/change-password', changePasswordValidator, update)

module.exports = router
