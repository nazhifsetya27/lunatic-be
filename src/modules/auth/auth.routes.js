const { Router } = require('express')
const {
  loginValidator,
  // updateValidator,
  // changePasswordValidator,
} = require('./auth.middleware')
const {
  login,
  getAllUser /* session, detail, update */,
} = require('./auth.repository')

const router = Router()

router.post('/', loginValidator, login)
router.get('/', getAllUser)
// router.use(auth)
// router.get('/session', session)
// router.get('/detail', detail)
// router.patch('/update', updateValidator, update)
// router.patch('/change-password', changePasswordValidator, update)

module.exports = router
