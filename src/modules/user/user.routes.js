const { Router } = require('express')
const { getAllUser } = require('../auth/auth.repository')
const { createUser, show, editUser, deleteUser, detail } = require('./user.controller')
const { storeRequest, findOneData } = require('./user.middleware')
const router = Router()
const { auth } = require('../../controller/auth.controller')

router.use(auth)
router.get('/', getAllUser)
router.post('/', storeRequest, createUser)
router.get('/:id', findOneData, show)
router.get('/:id/detail', findOneData, detail)
router.patch('/:id', findOneData, editUser)
router.delete('/:id', deleteUser)

module.exports = router
